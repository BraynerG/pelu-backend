import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IScheduleRepository } from '../../domain/interfaces/schedule.repository.interface';
import { BusinessSchedule, TimeOff } from '../../domain/entities/schedule.entity';

@Injectable()
export class PrismaScheduleRepository implements IScheduleRepository {
  private prisma = new PrismaClient();

  async getBusinessHours(): Promise<BusinessSchedule[]> {
    let schedules = await this.prisma.businessSchedule.findMany({
      orderBy: { dayOfWeek: 'asc' }
    });
    if (schedules.length === 0) {
      await this.seedDefaultBusinessHours();
      schedules = await this.prisma.businessSchedule.findMany({
        orderBy: { dayOfWeek: 'asc' }
      });
    }
    return schedules;
  }

  async seedDefaultBusinessHours(): Promise<void> {
    const defaultSchedules = [];
    for (let i = 0; i < 7; i++) {
      defaultSchedules.push({
        dayOfWeek: i,
        startTime: '09:00',
        endTime: '19:30',
        isClosed: i === 0, // Domingo cerrado por defecto
      });
    }
    await this.prisma.businessSchedule.createMany({
      data: defaultSchedules,
      skipDuplicates: true,
    });
  }

  async updateBusinessHours(schedules: Partial<BusinessSchedule>[]): Promise<BusinessSchedule[]> {
    for (const schedule of schedules) {
      if (schedule.dayOfWeek !== undefined) {
        await this.prisma.businessSchedule.update({
          where: { dayOfWeek: schedule.dayOfWeek },
          data: {
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            isClosed: schedule.isClosed,
          }
        });
      }
    }
    return this.getBusinessHours();
  }

  async getTimeOffs(): Promise<TimeOff[]> {
    const timeOffs = await this.prisma.timeOff.findMany({
      orderBy: { startDate: 'asc' }
    });
    return timeOffs.map((t: any) => ({
      id: t.id,
      startDate: t.startDate,
      endDate: t.endDate,
      reason: t.reason ?? undefined
    }));
  }

  async createTimeOff(data: Omit<TimeOff, 'id'>): Promise<TimeOff> {
    const t = await this.prisma.timeOff.create({
      data: {
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
      }
    });
    return {
      id: t.id,
      startDate: t.startDate,
      endDate: t.endDate,
      reason: t.reason ?? undefined
    };
  }

  async deleteTimeOff(id: string): Promise<void> {
    await this.prisma.timeOff.delete({
      where: { id }
    });
  }
}