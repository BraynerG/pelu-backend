export declare enum ReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    MODIFIED = "MODIFIED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export declare class ReservationEntity {
    id: string;
    customerName: string;
    customerPhone: string;
    date: Date;
    status: ReservationStatus;
    notes: string | null;
    serviceId: string;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ReservationEntity>);
}
