import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { RESERVATION_REPOSITORY } from '../../domain/interfaces/reservation.repository.interface';
import type { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';

@Injectable()
export class RescheduleReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(id: string, newDate: Date) {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada');
    }

    // Actualizar fecha y estado a MODIFIED
    return this.reservationRepository.update(id, { date: newDate, status: 'MODIFIED' as any });
  }
}
