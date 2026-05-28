import type { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { CreateServiceDto } from '../dtos/create-service.dto';
import { ServiceEntity } from '../../domain/entities/service.entity';
export declare class CreateServiceUseCase {
    private readonly serviceRepository;
    constructor(serviceRepository: IServiceRepository);
    execute(dto: CreateServiceDto): Promise<ServiceEntity>;
}
