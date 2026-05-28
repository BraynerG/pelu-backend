import { LoginUseCase, LoginDto } from '../../application/use-cases/login.use-case';
import { RegisterUseCase, RegisterDto } from '../../application/use-cases/register.use-case';
export declare class AuthController {
    private readonly loginUseCase;
    private readonly registerUseCase;
    constructor(loginUseCase: LoginUseCase, registerUseCase: RegisterUseCase);
    register(dto: RegisterDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
    }>;
    login(dto: LoginDto): Promise<{
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
