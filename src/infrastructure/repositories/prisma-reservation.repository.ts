import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../../domain/interfaces/reservation.repository.interface';
import { ReservationEntity, ReservationStatus } from '../../domain/entities/reservation.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PrismaReservationRepository implements IReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<ReservationEntity>): Promise<ReservationEntity> {
    const model = await this.prisma.reservation.create({
      data: {
        customerName: data.customerName!,
        customerPhone: data.customerPhone!,
        date: data.date!,
        status: data.status as any ?? 'PENDING',
        notes: data.notes ?? null,
        serviceId: data.serviceId!,
        variantId: data.variantId ?? null,
        userId: data.userId,
        googleEventId: data.googleEventId ?? null,
      }
    });
    return new ReservationEntity(model as any);
  }

  async findByServiceAndDate(serviceId: string, date: Date): Promise<ReservationEntity[]> {
    const models = await this.prisma.reservation.findMany({
      where: {
        serviceId,
        date,
      }
    });
    return models.map(model => new ReservationEntity(model as any));
  }

  async findAll(): Promise<ReservationEntity[]> {
    const models = await this.prisma.reservation.findMany({
      orderBy: { date: 'asc' }
    });
    return models.map(model => new ReservationEntity(model as any));
  }

  async findActive(): Promise<ReservationEntity[]> {
    const models = await this.prisma.reservation.findMany({
      where: {
        status: {
          notIn: ['CANCELLED', 'REJECTED']
        }
      },
      include: {
        service: true,
        variant: true
      },
      orderBy: { date: 'asc' }
    });
    return models.map(model => new ReservationEntity(model as any));
  }

  async findById(id: string): Promise<ReservationEntity | null> {
    const model = await this.prisma.reservation.findUnique({
      where: { id }
    });
    return model ? new ReservationEntity(model as any) : null;
  }

  async update(id: string, data: Partial<ReservationEntity>): Promise<ReservationEntity> {
    const model = await this.prisma.reservation.update({
      where: { id },
      data: {
        status: data.status as any,
        notes: data.notes,
        date: data.date,
        userId: data.userId,
        googleEventId: data.googleEventId,
      }
    });
    return new ReservationEntity(model as any);
  }
}
