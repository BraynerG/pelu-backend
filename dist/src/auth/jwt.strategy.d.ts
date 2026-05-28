import { Strategy } from 'passport-jwt';
import type { IUserRepository } from '../domain/interfaces/user.repository.interface';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    validate(payload: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        email: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
export {};
