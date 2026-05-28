import type { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { ServiceEntity } from '../../domain/entities/service.entity';
export declare class GetServicesUseCase {
    private readonly serviceRepository;
    constructor(serviceRepository: IServiceRepository);
    execute(): Promise<ServiceEntity[]>;
}
