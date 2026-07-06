import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { RESERVATION_REPOSITORY } from '../../domain/interfaces/reservation.repository.interface';
import type { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';
import { SERVICE_REPOSITORY } from '../../domain/interfaces/service.repository.interface';
import type { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { WHATSAPP_SERVICE } from '../../domain/interfaces/whatsapp-service.interface';
import type { IWhatsAppService } from '../../domain/interfaces/whatsapp-service.interface';
import { GOOGLE_CALENDAR_SERVICE } from '../../domain/interfaces/google-calendar-service.interface';
import type { IGoogleCalendarService } from '../../domain/interfaces/google-calendar-service.interface';
import { UpdateReservationDto } from '../dtos/admin-reservation.dto';

@Injectable()
export class UpdateReservationUseCase {
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

  async execute(id: string, dto: UpdateReservationDto) {
    const existingReservation = await this.reservationRepository.findById(id);
    if (!existingReservation) {
      throw new NotFoundException('Reserva no encontrada');
    }

    const updatedReservation = await this.reservationRepository.update(id, {
      ...(dto.customerName && { customerName: dto.customerName }),
      ...(dto.customerPhone && { customerPhone: dto.customerPhone }),
      ...(dto.serviceId && { serviceId: dto.serviceId }),
      ...(dto.variantId !== undefined && { variantId: dto.variantId || null }),
      ...(dto.notes !== undefined && { notes: dto.notes || null }),
      ...(dto.durationOverride !== undefined && { durationOverride: dto.durationOverride }),
    });

    const service = await this.serviceRepository.findById(updatedReservation.serviceId);
    const serviceName = service ? service.name : 'Ritual';
    const duration = updatedReservation.durationOverride ?? (service ? service.duration : 60);

    if (updatedReservation.googleEventId) {
      // Actualizar Google Calendar
      await this.googleCalendarService.updateEvent(
        updatedReservation.googleEventId,
        updatedReservation,
        serviceName,
        duration,
      );
    }

    // Enviar notificación por WhatsApp (en segundo plano)
    try {
      const formattedDate = new Date(updatedReservation.date).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const formattedTime = new Date(updatedReservation.date).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const msg = `Hola *${updatedReservation.customerName}*, los detalles de tu cita para el ritual *${serviceName}* el *${formattedDate}* a las *${formattedTime}* hs han sido actualizados por nuestro equipo. ¡Te esperamos!`;

      this.whatsappService.sendMessage(updatedReservation.customerPhone, msg).catch((err) => {
        console.error('Error al enviar WhatsApp de actualización de cita:', err.message);
      });
    } catch (err: any) {
      console.error('Fallo al enviar WhatsApp de actualización de cita:', err.message);
    }

    return updatedReservation;
  }
}
