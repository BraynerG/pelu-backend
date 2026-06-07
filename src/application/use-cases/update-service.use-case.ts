import { Injectable, Inject } from '@nestjs/common';
import { SERVICE_REPOSITORY } from '../../domain/interfaces/service.repository.interface';
import type { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { UpdateServiceDto } from '../dtos/update-service.dto';
import { ServiceEntity } from '../../domain/entities/service.entity';

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(id: string, dto: UpdateServiceDto): Promise<ServiceEntity> {
    return this.serviceRepository.update(id, dto);
  }
}
