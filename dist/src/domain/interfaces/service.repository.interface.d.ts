import { ServiceEntity } from '../entities/service.entity';
export declare const SERVICE_REPOSITORY = "SERVICE_REPOSITORY";
export interface IServiceRepository {
    findAll(): Promise<ServiceEntity[]>;
    findById(id: string): Promise<ServiceEntity | null>;
    create(service: Partial<ServiceEntity>): Promise<ServiceEntity>;
}
