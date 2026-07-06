const fs = require('fs');
const path = require('path');

const files = {
  "src/domain/entities/schedule.entity.ts": `
export class BusinessSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

export class TimeOff {
  id: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
}
`,
  "src/domain/interfaces/schedule.repository.interface.ts": `
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
`,
  "src/infrastructure/repositories/prisma-schedule.repository.ts": `
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
    return this.prisma.timeOff.findMany({
      orderBy: { startDate: 'asc' }
    });
  }

  async createTimeOff(data: Omit<TimeOff, 'id'>): Promise<TimeOff> {
    return this.prisma.timeOff.create({
      data: {
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
      }
    });
  }

  async deleteTimeOff(id: string): Promise<void> {
    await this.prisma.timeOff.delete({
      where: { id }
    });
  }
}
`,
  "src/application/dtos/schedule.dto.ts": `
import { IsString, IsBoolean, IsNumber, IsArray, ValidateNested, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class BusinessScheduleDto {
  @IsNumber()
  dayOfWeek: number;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsBoolean()
  isClosed: boolean;
}

export class UpdateBusinessHoursDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessScheduleDto)
  schedules: BusinessScheduleDto[];
}

export class CreateTimeOffDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
`,
  "src/application/use-cases/schedules.use-cases.ts": `
import { Injectable, Inject } from '@nestjs/common';
import { SCHEDULE_REPOSITORY, IScheduleRepository } from '../../domain/interfaces/schedule.repository.interface';
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
`,
  "src/presentation/controllers/schedules.controller.ts": `
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GetSchedulesUseCase, UpdateBusinessHoursUseCase, CreateTimeOffUseCase, DeleteTimeOffUseCase } from '../../application/use-cases/schedules.use-cases';
import { UpdateBusinessHoursDto, CreateTimeOffDto } from '../../application/dtos/schedule.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('schedules')
export class SchedulesController {
  constructor(
    private readonly getSchedulesUseCase: GetSchedulesUseCase,
    private readonly updateBusinessHoursUseCase: UpdateBusinessHoursUseCase,
    private readonly createTimeOffUseCase: CreateTimeOffUseCase,
    private readonly deleteTimeOffUseCase: DeleteTimeOffUseCase,
  ) {}

  @Get()
  async getSchedules() {
    const data = await this.getSchedulesUseCase.execute();
    return { success: true, data };
  }

  @Put('business-hours')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateBusinessHours(@Body() dto: UpdateBusinessHoursDto) {
    const data = await this.updateBusinessHoursUseCase.execute(dto);
    return { success: true, data };
  }

  @Post('time-offs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createTimeOff(@Body() dto: CreateTimeOffDto) {
    const data = await this.createTimeOffUseCase.execute(dto);
    return { success: true, data };
  }

  @Delete('time-offs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteTimeOff(@Param('id') id: string) {
    await this.deleteTimeOffUseCase.execute(id);
    return { success: true };
  }
}
`,
  "src/schedules/schedules.module.ts": `
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
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
  console.log('Created: ' + filepath);
}
