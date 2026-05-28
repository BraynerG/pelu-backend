import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IUserRepository, CreateUserDto } from '../../domain/interfaces/user.repository.interface';
import { User } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.passwordHash,
        name: data.name,
        phone: data.phone,
        role: data.role || 'CUSTOMER',
      },
    });
  }
}
