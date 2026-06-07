import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GetServicesUseCase } from '../../application/use-cases/get-services.use-case';
import { CreateServiceUseCase } from '../../application/use-cases/create-service.use-case';
import { UpdateServiceUseCase } from '../../application/use-cases/update-service.use-case';
import { DeleteServiceUseCase } from '../../application/use-cases/delete-service.use-case';
import { CreateServiceDto } from '../../application/dtos/create-service.dto';
import { UpdateServiceDto } from '../../application/dtos/update-service.dto';
import { CreateLookbookSlideDto } from '../../application/dtos/create-lookbook-slide.dto';
import { UpdateLookbookSlideDto } from '../../application/dtos/update-lookbook-slide.dto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly getServicesUseCase: GetServicesUseCase,
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly deleteServiceUseCase: DeleteServiceUseCase,
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

  @Post('lookbook')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createLookbook(@Body() createLookbookSlideDto: CreateLookbookSlideDto) {
    const slide = await this.prisma.lookbookSlide.create({
      data: {
        url: createLookbookSlideDto.url,
        title: createLookbookSlideDto.title,
        subtitle: createLookbookSlideDto.subtitle ?? '',
        tag: createLookbookSlideDto.tag,
        accent: createLookbookSlideDto.accent ?? null,
      }
    });
    return {
      success: true,
      data: slide,
    };
  }

  @Patch('lookbook/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateLookbook(@Param('id') id: string, @Body() updateLookbookSlideDto: UpdateLookbookSlideDto) {
    const slide = await this.prisma.lookbookSlide.update({
      where: { id },
      data: {
        url: updateLookbookSlideDto.url,
        title: updateLookbookSlideDto.title,
        subtitle: updateLookbookSlideDto.subtitle,
        tag: updateLookbookSlideDto.tag,
        accent: updateLookbookSlideDto.accent,
      }
    });
    return {
      success: true,
      data: slide,
    };
  }

  @Delete('lookbook/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removeLookbook(@Param('id') id: string) {
    await this.prisma.lookbookSlide.delete({ where: { id } });
    return {
      success: true,
      message: 'Diapositiva eliminada correctamente',
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() createServiceDto: CreateServiceDto) {
    const service = await this.createServiceUseCase.execute(createServiceDto);
    return {
      success: true,
      data: service,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    const service = await this.updateServiceUseCase.execute(id, updateServiceDto);
    return {
      success: true,
      data: service,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    await this.deleteServiceUseCase.execute(id);
    return {
      success: true,
      message: 'Servicio eliminado correctamente',
    };
  }
}

