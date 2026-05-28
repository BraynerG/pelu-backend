import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/interfaces/user.repository.interface';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      }
    };
  }
}
