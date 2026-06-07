import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PrismaServiceRepository implements IServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ServiceEntity[]> {
    const models = await this.prisma.service.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return models.map(model => new ServiceEntity(model));
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    const model = await this.prisma.service.findUnique({ where: { id } });
    if (!model) return null;
    return new ServiceEntity(model);
  }

  async create(data: Partial<ServiceEntity>): Promise<ServiceEntity> {
    const model = await this.prisma.service.create({
      data: {
        name: data.name!,
        description: data.description ?? '',
        price: data.price!,
        duration: data.duration!,
        imageUrl: data.imageUrl ?? null,
        category: data.category ?? 'hair',
        steps: data.steps ?? [],
      }
    });
    return new ServiceEntity(model);
  }

  async update(id: string, data: Partial<ServiceEntity>): Promise<ServiceEntity> {
    const model = await this.prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description === null ? '' : data.description,
        price: data.price,
        duration: data.duration,
        imageUrl: data.imageUrl,
        category: data.category,
        steps: data.steps,
      }
    });
    return new ServiceEntity(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.service.delete({ where: { id } });
  }
}
