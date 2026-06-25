import { BusinessSchedule, TimeOff } from '../entities/schedule.entity';

export const SCHEDULE_REPOSITORY = 'SCHEDULE_REPOSITORY';

export interface IScheduleRepository {
  getBusinessHours(): Promise<BusinessSchedule[]>;
  updateBusinessHours(schedules: Partial<BusinessSchedule>[]): Promise<BusinessSchedule[]>;
  getTimeOffs(): Promise<TimeOff[]>;
  createTimeOff(data: Omit<TimeOff, 'id'>): Promise<TimeOff>;
  deleteTimeOff(id: string): Promise<void>;
  seedDefaultBusinessHours(): Promise<void>;
}