import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/interfaces/user.repository.interface';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import * as bcrypt from 'bcrypt';

export class RegisterDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'ADMIN' | 'CUSTOMER';
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      phone: dto.phone,
      role: dto.role,
    });

    const { password, ...result } = user;
    return result;
  }
}
