import { User } from '@prisma/client';
export declare const USER_REPOSITORY = "USER_REPOSITORY";
export interface CreateUserDto {
    email: string;
    passwordHash: string;
    name: string;
    phone?: string;
    role?: 'ADMIN' | 'CUSTOMER';
}
export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(data: CreateUserDto): Promise<User>;
}
