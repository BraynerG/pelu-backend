export class ServiceVariantEntity {
  id: string;
  name: string;
  price: number;
  duration: number;
  serviceId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ServiceVariantEntity>) {
    Object.assign(this, partial);
  }
}

export class ServiceEntity {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number; // in minutes
  imageUrl: string | null;
  category: string;
  steps: string[];
  createdAt: Date;
  updatedAt: Date;
  variants?: Partial<ServiceVariantEntity>[];

  constructor(partial: Partial<ServiceEntity>) {
    Object.assign(this, partial);
    if (partial.variants) {
      this.variants = partial.variants.map(v => new ServiceVariantEntity(v));
    }
  }
}
