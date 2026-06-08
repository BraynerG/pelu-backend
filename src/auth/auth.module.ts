import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../presentation/controllers/auth.controller';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { USER_REPOSITORY } from '../domain/interfaces/user.repository.interface';
import { PrismaUserRepository } from '../infrastructure/repositories/prisma-user.repository';
import { PrismaService } from '../infrastructure/database/prisma.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: (() => {
        const secret = process.env.JWT_SECRET;
        if (!secret && process.env.NODE_ENV === 'production') {
          throw new Error('JWT_SECRET must be defined in production!');
        }
        return secret || 'secretKey';
      })(),
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    PrismaService,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY, JwtModule],
})
export class AuthModule {}
