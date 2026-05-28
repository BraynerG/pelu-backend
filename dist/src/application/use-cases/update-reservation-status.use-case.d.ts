import type { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';
import { ReservationEntity, ReservationStatus } from '../../domain/entities/reservation.entity';
export declare class UpdateReservationStatusUseCase {
    private readonly reservationRepository;
    constructor(reservationRepository: IReservationRepository);
    execute(id: string, status: ReservationStatus): Promise<ReservationEntity>;
}
