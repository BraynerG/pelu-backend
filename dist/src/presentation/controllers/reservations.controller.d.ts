import { CreateReservationUseCase } from '../../application/use-cases/create-reservation.use-case';
import { GetReservationsUseCase } from '../../application/use-cases/get-reservations.use-case';
import { UpdateReservationStatusUseCase } from '../../application/use-cases/update-reservation-status.use-case';
import { RescheduleReservationUseCase } from '../../application/use-cases/reschedule-reservation.use-case';
import { CreateReservationDto } from '../../application/dtos/create-reservation.dto';
import { ReservationStatus } from '../../domain/entities/reservation.entity';
export declare class ReservationsController {
    private readonly createReservationUseCase;
    private readonly getReservationsUseCase;
    private readonly updateReservationStatusUseCase;
    private readonly rescheduleReservationUseCase;
    constructor(createReservationUseCase: CreateReservationUseCase, getReservationsUseCase: GetReservationsUseCase, updateReservationStatusUseCase: UpdateReservationStatusUseCase, rescheduleReservationUseCase: RescheduleReservationUseCase);
    create(createReservationDto: CreateReservationDto, req: any): Promise<{
        success: boolean;
        data: import("../../domain/entities/reservation.entity").ReservationEntity;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: import("../../domain/entities/reservation.entity").ReservationEntity[];
    }>;
    updateStatus(id: string, status: ReservationStatus): Promise<{
        success: boolean;
        data: import("../../domain/entities/reservation.entity").ReservationEntity;
    }>;
    reschedule(id: string, date: string): Promise<{
        success: boolean;
        data: import("../../domain/entities/reservation.entity").ReservationEntity;
    }>;
}
