import { Module } from '@nestjs/common';
import { ServicesController } from '../presentation/controllers/services.controller';
import { GetServicesUseCase } from '../application/use-cases/get-services.use-case';
import { CreateServiceUseCase } from '../application/use-cases/create-service.use-case';
import { PrismaServiceRepository } from '../infrastructure/repositories/prisma-service.repository';
import { SERVICE_REPOSITORY } from '../domain/interfaces/service.repository.interface';
import { PrismaService } from '../infrastructure/database/prisma.service';

@Module({
  controllers: [ServicesController],
  providers: [
    PrismaService,
    GetServicesUseCase,
    CreateServiceUseCase,
    {
      provide: SERVICE_REPOSITORY,
      useClass: PrismaServiceRepository,
    },
  ],
  exports: [SERVICE_REPOSITORY],
})
export class ServicesModule {}

