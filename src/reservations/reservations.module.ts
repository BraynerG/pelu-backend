import { Module } from '@nestjs/common';
import { ReservationsController } from '../presentation/controllers/reservations.controller';
import { CreateReservationUseCase } from '../application/use-cases/create-reservation.use-case';
import { GetReservationsUseCase } from '../application/use-cases/get-reservations.use-case';
import { UpdateReservationStatusUseCase } from '../application/use-cases/update-reservation-status.use-case';
import { RescheduleReservationUseCase } from '../application/use-cases/reschedule-reservation.use-case';
import { GetOccupiedSlotsUseCase } from '../application/use-cases/get-occupied-slots.use-case';
import { PrismaReservationRepository } from '../infrastructure/repositories/prisma-reservation.repository';
import { RESERVATION_REPOSITORY } from '../domain/interfaces/reservation.repository.interface';
import { PrismaService } from '../infrastructure/database/prisma.service';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [ReservationsController],
  providers: [
    PrismaService,
    CreateReservationUseCase,
    GetReservationsUseCase,
    UpdateReservationStatusUseCase,
    RescheduleReservationUseCase,
    GetOccupiedSlotsUseCase,
    {
      provide: RESERVATION_REPOSITORY,
      useClass: PrismaReservationRepository,
    },
  ],
})
export class ReservationsModule {}
