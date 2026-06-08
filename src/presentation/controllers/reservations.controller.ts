import { Controller, Post, Body, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { CreateReservationUseCase } from '../../application/use-cases/create-reservation.use-case';
import { GetReservationsUseCase } from '../../application/use-cases/get-reservations.use-case';
import { UpdateReservationStatusUseCase } from '../../application/use-cases/update-reservation-status.use-case';
import { RescheduleReservationUseCase } from '../../application/use-cases/reschedule-reservation.use-case';
import { GetOccupiedSlotsUseCase } from '../../application/use-cases/get-occupied-slots.use-case';
import { CreateReservationDto } from '../../application/dtos/create-reservation.dto';
import { ReservationStatus } from '../../domain/entities/reservation.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { OptionalJwtAuthGuard } from '../../auth/optional-jwt-auth.guard';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly getReservationsUseCase: GetReservationsUseCase,
    private readonly updateReservationStatusUseCase: UpdateReservationStatusUseCase,
    private readonly rescheduleReservationUseCase: RescheduleReservationUseCase,
    private readonly getOccupiedSlotsUseCase: GetOccupiedSlotsUseCase,
  ) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  async create(@Body() createReservationDto: CreateReservationDto, @Req() req: any) {
    const userId = req.user?.id;
    const reservation = await this.createReservationUseCase.execute(createReservationDto, userId);
    return {
      success: true,
      data: reservation,
    };
  }

  @Get('occupied')
  async getOccupied() {
    const occupied = await this.getOccupiedSlotsUseCase.execute();
    return {
      success: true,
      data: occupied,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    const reservations = await this.getReservationsUseCase.execute();
    return {
      success: true,
      data: reservations,
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReservationStatus,
  ) {
    const reservation = await this.updateReservationStatusUseCase.execute(id, status);
    return {
      success: true,
      data: reservation,
    };
  }

  @Patch(':id/reschedule')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async reschedule(
    @Param('id') id: string,
    @Body('date') date: string,
  ) {
    const reservation = await this.rescheduleReservationUseCase.execute(id, new Date(date));
    return {
      success: true,
      data: reservation,
    };
  }
}
