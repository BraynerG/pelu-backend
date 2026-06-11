import { Injectable, Logger } from '@nestjs/common';
import { IWhatsAppService, WhatsAppStatus } from '../../domain/interfaces/whatsapp-service.interface';

@Injectable()
export class MockWhatsAppService implements IWhatsAppService {
  private readonly logger = new Logger(MockWhatsAppService.name);

  async initialize(): Promise<void> {
    this.logger.log('Inicializando MockWhatsAppService (Simulación)...');
  }

  async sendMessage(to: string, message: string): Promise<boolean> {
    this.logger.log(`[SIMULACIÓN WHATSAPP] Enviando mensaje a ${to}:`);
    this.logger.log(`-----------------------------------------------`);
    this.logger.log(message);
    this.logger.log(`-----------------------------------------------`);
    return true;
  }

  async getStatus(): Promise<WhatsAppStatus> {
    return {
      authenticated: false,
      status: 'DISCONNECTED',
      provider: 'mock-logger',
      phoneNumber: 'Simulación (Vercel Serverless/Dev)',
    };
  }

  async logout(): Promise<void> {
    this.logger.log('Cerrando sesión de simulación...');
  }
}
