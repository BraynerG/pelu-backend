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