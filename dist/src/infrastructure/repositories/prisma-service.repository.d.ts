import { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { PrismaService } from '../database/prisma.service';
export declare class PrismaServiceRepository implements IServiceRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<ServiceEntity[]>;
    findById(id: string): Promise<ServiceEntity | null>;
    create(data: Partial<ServiceEntity>): Promise<ServiceEntity>;
}
