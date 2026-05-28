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

  constructor(partial: Partial<ServiceEntity>) {
    Object.assign(this, partial);
  }
}
