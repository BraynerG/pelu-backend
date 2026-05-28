import type { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';
import type { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { ReservationEntity } from '../../domain/entities/reservation.entity';
export declare class CreateReservationUseCase {
    private readonly reservationRepository;
    private readonly serviceRepository;
    constructor(reservationRepository: IReservationRepository, serviceRepository: IServiceRepository);
    execute(dto: CreateReservationDto, userId?: string): Promise<ReservationEntity>;
}
