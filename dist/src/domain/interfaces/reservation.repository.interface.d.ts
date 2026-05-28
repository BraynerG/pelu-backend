import { ReservationEntity } from '../entities/reservation.entity';
export declare const RESERVATION_REPOSITORY = "RESERVATION_REPOSITORY";
export interface IReservationRepository {
    create(reservation: Partial<ReservationEntity>): Promise<ReservationEntity>;
    findByServiceAndDate(serviceId: string, date: Date): Promise<ReservationEntity[]>;
    findAll(): Promise<ReservationEntity[]>;
    findById(id: string): Promise<ReservationEntity | null>;
    update(id: string, data: Partial<ReservationEntity>): Promise<ReservationEntity>;
}
