import { Module } from '@nestjs/common';
import { SchedulesController } from '../presentation/controllers/schedules.controller';
import { GetSchedulesUseCase, UpdateBusinessHoursUseCase, CreateTimeOffUseCase, DeleteTimeOffUseCase } from '../application/use-cases/schedules.use-cases';
import { PrismaScheduleRepository } from '../infrastructure/repositories/prisma-schedule.repository';
import { SCHEDULE_REPOSITORY } from '../domain/interfaces/schedule.repository.interface';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SchedulesController],
  providers: [
    {
      provide: SCHEDULE_REPOSITORY,
      useClass: PrismaScheduleRepository,
    },
    GetSchedulesUseCase,
    UpdateBusinessHoursUseCase,
    CreateTimeOffUseCase,
    DeleteTimeOffUseCase,
  ],
  exports: [SCHEDULE_REPOSITORY],
})
export class SchedulesModule {}