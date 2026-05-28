import type { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';
export declare class RescheduleReservationUseCase {
    private readonly reservationRepository;
    constructor(reservationRepository: IReservationRepository);
    execute(id: string, newDate: Date): Promise<import("../../domain/entities/reservation.entity").ReservationEntity>;
}
