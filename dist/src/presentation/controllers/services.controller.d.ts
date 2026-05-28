import { GetServicesUseCase } from '../../application/use-cases/get-services.use-case';
import { CreateServiceUseCase } from '../../application/use-cases/create-service.use-case';
import { CreateServiceDto } from '../../application/dtos/create-service.dto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
export declare class ServicesController {
    private readonly getServicesUseCase;
    private readonly createServiceUseCase;
    private readonly prisma;
    constructor(getServicesUseCase: GetServicesUseCase, createServiceUseCase: CreateServiceUseCase, prisma: PrismaService);
    getLookbook(): Promise<{
        success: boolean;
        data: {
            id: string;
            url: string;
            title: string;
            subtitle: string;
            tag: string;
            accent: string | null;
            createdAt: Date;
        }[];
    }>;
    findAll(): Promise<{
        success: boolean;
        data: import("../../domain/entities/service.entity").ServiceEntity[];
    }>;
    create(createServiceDto: CreateServiceDto): Promise<{
        success: boolean;
        data: import("../../domain/entities/service.entity").ServiceEntity;
    }>;
}
