import { Injectable, Inject } from '@nestjs/common';
import { SCHEDULE_REPOSITORY } from '../../domain/interfaces/schedule.repository.interface';
import type { IScheduleRepository } from '../../domain/interfaces/schedule.repository.interface';
import { UpdateBusinessHoursDto, CreateTimeOffDto } from '../dtos/schedule.dto';

@Injectable()
export class GetSchedulesUseCase {
  constructor(@Inject(SCHEDULE_REPOSITORY) private repo: IScheduleRepository) {}
  async execute() {
    const [businessHours, timeOffs] = await Promise.all([
      this.repo.getBusinessHours(),
      this.repo.getTimeOffs(),
    ]);
    return { businessHours, timeOffs };
  }
}

@Injectable()
export class UpdateBusinessHoursUseCase {
  constructor(@Inject(SCHEDULE_REPOSITORY) private repo: IScheduleRepository) {}
  async execute(dto: UpdateBusinessHoursDto) {
    return this.repo.updateBusinessHours(dto.schedules);
  }
}

@Injectable()
export class CreateTimeOffUseCase {
  constructor(@Inject(SCHEDULE_REPOSITORY) private repo: IScheduleRepository) {}
  async execute(dto: CreateTimeOffDto) {
    return this.repo.createTimeOff({
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      reason: dto.reason,
    });
  }
}

@Injectable()
export class DeleteTimeOffUseCase {
  constructor(@Inject(SCHEDULE_REPOSITORY) private repo: IScheduleRepository) {}
  async execute(id: string) {
    return this.repo.deleteTimeOff(id);
  }
}