export declare class ServiceEntity {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    imageUrl: string | null;
    category: string;
    steps: string[];
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ServiceEntity>);
}
