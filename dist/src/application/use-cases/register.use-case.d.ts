import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: 'ADMIN' | 'CUSTOMER';
}
export declare class RegisterUseCase {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(dto: RegisterDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
