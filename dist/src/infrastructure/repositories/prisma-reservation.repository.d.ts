import { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';
import { ReservationEntity } from '../../domain/entities/reservation.entity';
import { PrismaService } from '../database/prisma.service';
export declare class PrismaReservationRepository implements IReservationRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Partial<ReservationEntity>): Promise<ReservationEntity>;
    findByServiceAndDate(serviceId: string, date: Date): Promise<ReservationEntity[]>;
    findAll(): Promise<ReservationEntity[]>;
    findById(id: string): Promise<ReservationEntity | null>;
    update(id: string, data: Partial<ReservationEntity>): Promise<ReservationEntity>;
}
