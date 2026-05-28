import type { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';
import { ReservationEntity } from '../../domain/entities/reservation.entity';
export declare class GetReservationsUseCase {
    private readonly reservationRepository;
    constructor(reservationRepository: IReservationRepository);
    execute(): Promise<ReservationEntity[]>;
}
