import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { RESERVATION_REPOSITORY } from '../../domain/interfaces/reservation.repository.interface';
import type { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';
import { ReservationEntity, ReservationStatus } from '../../domain/entities/reservation.entity';

@Injectable()
export class UpdateReservationStatusUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(id: string, status: ReservationStatus): Promise<ReservationEntity> {
    // 1. Validar que el status sea válido
    if (!Object.values(ReservationStatus).includes(status)) {
      throw new BadRequestException('Estado de reserva no válido');
    }

    // 2. Actualizar la reserva
    try {
      const reservation = await this.reservationRepository.update(id, { status });
      return reservation;
    } catch (error) {
      throw new BadRequestException('No se pudo actualizar la reserva. Es posible que el ID no exista.');
    }
  }
}
