import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { RESERVATION_REPOSITORY } from '../../domain/interfaces/reservation.repository.interface';
import type { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';
import { SERVICE_REPOSITORY } from '../../domain/interfaces/service.repository.interface';
import type { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { ReservationEntity, ReservationStatus } from '../../domain/entities/reservation.entity';
import { WHATSAPP_SERVICE } from '../../domain/interfaces/whatsapp-service.interface';
import type { IWhatsAppService } from '../../domain/interfaces/whatsapp-service.interface';

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
    @Inject(WHATSAPP_SERVICE)
    private readonly whatsappService: IWhatsAppService,
  ) {}

  async execute(dto: CreateReservationDto, userId?: string): Promise<ReservationEntity> {
    // 1. Verificar que el servicio existe
    const service = await this.serviceRepository.findById(dto.serviceId);
    if (!service) {
      throw new BadRequestException('El servicio especificado no existe');
    }

    // 2. Si se especifica una variante, verificar que pertenezca al servicio
    if (dto.variantId) {
      const variant = service.variants?.find(v => v.id === dto.variantId);
      if (!variant) {
        throw new BadRequestException('La variante especificada no pertenece a este servicio');
      }
    }

    // 3. Validar que la fecha sea en el futuro
    const reservationDate = new Date(dto.date);
    if (reservationDate <= new Date()) {
      throw new BadRequestException('La fecha de la reserva debe ser en el futuro');
    }

    // 4. Crear la reserva
    const reservation = await this.reservationRepository.create({
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      date: reservationDate,
      status: ReservationStatus.PENDING,
      notes: dto.notes,
      serviceId: dto.serviceId,
      variantId: dto.variantId ?? null,
      userId: userId,
    });

    // 5. Enviar mensaje de WhatsApp (en segundo plano)
    try {
      const formattedDate = reservationDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const formattedTime = reservationDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const msg = `Hola *${reservation.customerName}*, tu solicitud de reserva para el ritual *${service.name}* el *${formattedDate}* a las *${formattedTime}* hs ha sido recibida y está *pendiente de confirmación*. Te avisaremos pronto. ¡Muchas gracias!`;

      this.whatsappService.sendMessage(reservation.customerPhone, msg).catch((err) => {
        console.error('Error al enviar WhatsApp de reserva:', err.message);
      });
    } catch (err: any) {
      console.error('Fallo al dar formato o enviar WhatsApp de reserva:', err.message);
    }

    return reservation;
  }
}
