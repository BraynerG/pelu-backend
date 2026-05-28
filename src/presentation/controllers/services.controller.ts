import { Controller, Get, Post, Body } from '@nestjs/common';
import { GetServicesUseCase } from '../../application/use-cases/get-services.use-case';
import { CreateServiceUseCase } from '../../application/use-cases/create-service.use-case';
import { CreateServiceDto } from '../../application/dtos/create-service.dto';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly getServicesUseCase: GetServicesUseCase,
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly prisma: PrismaService,
  ) {}

  @Get('lookbook')
  async getLookbook() {
    const slides = await this.prisma.lookbookSlide.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return {
      success: true,
      data: slides,
    };
  }

  @Get()
  async findAll() {
    const services = await this.getServicesUseCase.execute();
    return {
      success: true,
      data: services,
    };
  }

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    const service = await this.createServiceUseCase.execute(createServiceDto);
    return {
      success: true,
      data: service,
    };
  }
}

