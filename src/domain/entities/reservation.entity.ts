export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  MODIFIED = 'MODIFIED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export class ReservationEntity {
  id: string;
  customerName: string;
  customerPhone: string;
  date: Date;
  status: ReservationStatus;
  notes: string | null;
  serviceId: string;
  variantId: string | null;
  userId: string | null;
  googleEventId: string | null;
  createdAt: Date;
  updatedAt: Date;
  variant?: any; // To avoid circular dependency, keep as any or import from service.entity

  constructor(partial: Partial<ReservationEntity>) {
    Object.assign(this, partial);
  }
}
