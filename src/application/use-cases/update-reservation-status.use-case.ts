import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { RESERVATION_REPOSITORY } from '../../domain/interfaces/reservation.repository.interface';
import type { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';
import { ReservationEntity, ReservationStatus } from '../../domain/entities/reservation.entity';
import { SERVICE_REPOSITORY } from '../../domain/interfaces/service.repository.interface';
import type { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { WHATSAPP_SERVICE } from '../../domain/interfaces/whatsapp-service.interface';
import type { IWhatsAppService } from '../../domain/interfaces/whatsapp-service.interface';
import { GOOGLE_CALENDAR_SERVICE } from '../../domain/interfaces/google-calendar-service.interface';
import type { IGoogleCalendarService } from '../../domain/interfaces/google-calendar-service.interface';

@Injectable()
export class UpdateReservationStatusUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
    @Inject(WHATSAPP_SERVICE)
    private readonly whatsappService: IWhatsAppService,
    @Inject(GOOGLE_CALENDAR_SERVICE)
    private readonly googleCalendarService: IGoogleCalendarService,
  ) {}

  async execute(id: string, status: ReservationStatus): Promise<ReservationEntity> {
    // 1. Validar que el status sea válido
    if (!Object.values(ReservationStatus).includes(status)) {
      throw new BadRequestException('Estado de reserva no válido');
    }

    // 2. Obtener reserva actual para verificar existencia
    const existingReservation = await this.reservationRepository.findById(id);
    if (!existingReservation) {
      throw new BadRequestException('La reserva especificada no existe.');
    }

    // 3. Actualizar la reserva
    let reservation: ReservationEntity;
    try {
      reservation = await this.reservationRepository.update(id, { status });
    } catch (error) {
      throw new BadRequestException('No se pudo actualizar la reserva. Es posible que el ID no exista.');
    }

    // 4. Gestionar evento en Google Calendar (en segundo plano)
    if (status === ReservationStatus.CONFIRMED) {
      if (!existingReservation.googleEventId) {
        try {
          const service = await this.serviceRepository.findById(reservation.serviceId);
          const serviceName = service ? service.name : 'Ritual';
          const duration = service ? service.duration : 60;

          const eventId = await this.googleCalendarService.createEvent(reservation, serviceName, duration);
          if (eventId) {
            reservation = await this.reservationRepository.update(id, { googleEventId: eventId });
          }
        } catch (calendarErr: any) {
          console.error('Error al crear evento en Google Calendar:', calendarErr.message);
        }
      }
    } else {
      // Si cambia a cualquier estado que no sea CONFIRMED y tiene un evento creado, lo eliminamos
      if (existingReservation.googleEventId) {
        try {
          const success = await this.googleCalendarService.deleteEvent(existingReservation.googleEventId);
          if (success) {
            reservation = await this.reservationRepository.update(id, { googleEventId: null });
          }
        } catch (calendarErr: any) {
          console.error('Error al eliminar evento de Google Calendar:', calendarErr.message);
        }
      }
    }

    // 4. Enviar notificación por WhatsApp (en segundo plano)
    if (status === ReservationStatus.CONFIRMED || status === ReservationStatus.CANCELLED) {
      try {
        const service = await this.serviceRepository.findById(reservation.serviceId);
        const serviceName = service ? service.name : 'Ritual';

        const formattedDate = new Date(reservation.date).toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        const formattedTime = new Date(reservation.date).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        let msg = '';
        if (status === ReservationStatus.CONFIRMED) {
          msg = `¡Hola *${reservation.customerName}*! Tu reserva para el ritual *${serviceName}* el *${formattedDate}* a las *${formattedTime}* hs ha sido *confirmada*. Te esperamos en nuestro espacio. ¡Muchas gracias por elegir a Karen Mendez!`;
        } else if (status === ReservationStatus.CANCELLED) {
          msg = `Hola *${reservation.customerName}*, lamentamos informarte que tu reserva para el ritual *${serviceName}* el *${formattedDate}* a las *${formattedTime}* hs ha sido *cancelada*. Esperamos verte pronto en otra ocasión.`;
        }

        if (msg) {
          this.whatsappService.sendMessage(reservation.customerPhone, msg).catch((err) => {
            console.error('Error al enviar WhatsApp de cambio de estado:', err.message);
          });
        }
      } catch (err: any) {
        console.error('Fallo al enviar WhatsApp de cambio de estado:', err.message);
      }
    }

    return reservation;
  }
}
