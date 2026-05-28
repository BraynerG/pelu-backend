import { Injectable, Inject } from '@nestjs/common';
import { SERVICE_REPOSITORY } from '../../domain/interfaces/service.repository.interface';
import type { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { CreateServiceDto } from '../dtos/create-service.dto';
import { ServiceEntity } from '../../domain/entities/service.entity';

@Injectable()
export class CreateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(dto: CreateServiceDto): Promise<ServiceEntity> {
    return this.serviceRepository.create(dto);
  }
}
