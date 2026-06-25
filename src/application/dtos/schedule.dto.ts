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