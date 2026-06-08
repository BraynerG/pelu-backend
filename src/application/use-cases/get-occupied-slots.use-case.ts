import { Inject, Injectable } from '@nestjs/common';
import { RESERVATION_REPOSITORY } from '../../domain/interfaces/reservation.repository.interface';
import type { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';

@Injectable()
export class GetOccupiedSlotsUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(): Promise<{ date: Date; duration: number }[]> {
    const activeReservations = await this.reservationRepository.findActive();
    return activeReservations.map(res => {
      // Get duration from variant or service, default to 30 mins
      const duration = res.variant?.duration ?? (res as any).service?.duration ?? 30;
      return {
        date: res.date,
        duration,
      };
    });
  }
}
