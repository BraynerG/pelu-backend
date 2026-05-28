"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_controller_1 = require("../presentation/controllers/auth.controller");
const login_use_case_1 = require("../application/use-cases/login.use-case");
const register_use_case_1 = require("../application/use-cases/register.use-case");
const user_repository_interface_1 = require("../domain/interfaces/user.repository.interface");
const prisma_user_repository_1 = require("../infrastructure/repositories/prisma-user.repository");
const prisma_service_1 = require("../infrastructure/database/prisma.service");
const jwt_strategy_1 = require("./jwt.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: (() => {
                    const secret = process.env.JWT_SECRET;
                    if (!secret && process.env.NODE_ENV === 'production') {
                        throw new Error('JWT_SECRET must be defined in production!');
                    }
                    return secret || 'secretKey';
                })(),
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            login_use_case_1.LoginUseCase,
            register_use_case_1.RegisterUseCase,
            prisma_service_1.PrismaService,
            jwt_strategy_1.JwtStrategy,
            {
                provide: user_repository_interface_1.USER_REPOSITORY,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
        ],
        exports: [user_repository_interface_1.USER_REPOSITORY, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map