import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { WHATSAPP_SERVICE } from '../../domain/interfaces/whatsapp-service.interface';
import type { IWhatsAppService } from '../../domain/interfaces/whatsapp-service.interface';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class WhatsAppController {
  constructor(
    @Inject(WHATSAPP_SERVICE)
    private readonly whatsappService: IWhatsAppService,
  ) {}

  @Get('status')
  async getStatus() {
    const status = await this.whatsappService.getStatus();
    return {
      success: true,
      data: status,
    };
  }

  @Post('logout')
  async logout() {
    await this.whatsappService.logout();
    return {
      success: true,
      message: 'Sesión de WhatsApp cerrada y credenciales locales eliminadas.',
    };
  }

  @Post('send-test')
  async sendTest(
    @Body('to') to: string,
    @Body('message') message: string,
  ) {
    const success = await this.whatsappService.sendMessage(to, message);
    return {
      success,
      message: success ? 'Mensaje de prueba enviado.' : 'No se pudo enviar el mensaje de prueba.',
    };
  }
}
