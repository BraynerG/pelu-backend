import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { JwtService } from '@nestjs/jwt';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class LoginUseCase {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: IUserRepository, jwtService: JwtService);
    execute(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            phone: string | null;
        };
    }>;
}
