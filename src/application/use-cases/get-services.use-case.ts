import { Injectable, Inject } from '@nestjs/common';
import { SERVICE_REPOSITORY } from '../../domain/interfaces/service.repository.interface';
import type { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { ServiceEntity } from '../../domain/entities/service.entity';

@Injectable()
export class GetServicesUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(): Promise<ServiceEntity[]> {
    return this.serviceRepository.findAll();
  }
}
