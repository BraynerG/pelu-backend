import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { RESERVATION_REPOSITORY } from '../../domain/interfaces/reservation.repository.interface';
import type { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';
import { SERVICE_REPOSITORY } from '../../domain/interfaces/service.repository.interface';
import type { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { WHATSAPP_SERVICE } from '../../domain/interfaces/whatsapp-service.interface';
import type { IWhatsAppService } from '../../domain/interfaces/whatsapp-service.interface';
import { GOOGLE_CALENDAR_SERVICE } from '../../domain/interfaces/google-calendar-service.interface';
import type { IGoogleCalendarService } from '../../domain/interfaces/google-calendar-service.interface';

@Injectable()
export class RescheduleReservationUseCase {
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

  async execute(id: string, newDate: Date) {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada');
    }

    // Si tiene un evento en Google Calendar, lo eliminamos (al reprogramarse, la cita cambia de fecha y pasa a MODIFIED)
    if (reservation.googleEventId) {
      try {
        await this.googleCalendarService.deleteEvent(reservation.googleEventId);
      } catch (calendarErr: any) {
        console.error('Error al eliminar evento de Google Calendar al reprogramar:', calendarErr.message);
      }
    }

    // Actualizar fecha, estado a MODIFIED y limpiar googleEventId
    const updatedReservation = await this.reservationRepository.update(id, {
      date: newDate,
      status: 'MODIFIED' as any,
      googleEventId: null,
    });

    // Enviar notificación por WhatsApp (en segundo plano)
    try {
      const service = await this.serviceRepository.findById(updatedReservation.serviceId);
      const serviceName = service ? service.name : 'Ritual';

      const formattedDate = newDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const formattedTime = newDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const msg = `Hola *${updatedReservation.customerName}*, tu reserva para el ritual *${serviceName}* ha sido *reprogramada*. La nueva cita es el *${formattedDate}* a las *${formattedTime}* hs. ¡Te esperamos!`;

      this.whatsappService.sendMessage(updatedReservation.customerPhone, msg).catch((err) => {
        console.error('Error al enviar WhatsApp de reprogramación:', err.message);
      });
    } catch (err: any) {
      console.error('Fallo al enviar WhatsApp de reprogramación:', err.message);
    }

    return updatedReservation;
  }
}
