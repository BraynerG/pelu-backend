import { PrismaService } from '../database/prisma.service';
import { IUserRepository, CreateUserDto } from '../../domain/interfaces/user.repository.interface';
import { User } from '@prisma/client';
export declare class PrismaUserRepository implements IUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(data: CreateUserDto): Promise<User>;
}
