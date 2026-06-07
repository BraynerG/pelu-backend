import { ServiceEntity } from '../entities/service.entity';

export const SERVICE_REPOSITORY = 'SERVICE_REPOSITORY';

export interface IServiceRepository {
  findAll(): Promise<ServiceEntity[]>;
  findById(id: string): Promise<ServiceEntity | null>;
  create(service: Partial<ServiceEntity>): Promise<ServiceEntity>;
  update(id: string, service: Partial<ServiceEntity>): Promise<ServiceEntity>;
  delete(id: string): Promise<void>;
}
