import { Inject, Injectable } from '@nestjs/common';
import { RESERVATION_REPOSITORY } from '../../domain/interfaces/reservation.repository.interface';
import type { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';
import { ReservationEntity } from '../../domain/entities/reservation.entity';

@Injectable()
export class GetReservationsUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(): Promise<ReservationEntity[]> {
    return this.reservationRepository.findAll();
  }
}
