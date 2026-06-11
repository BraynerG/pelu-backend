import { Injectable, Logger } from '@nestjs/common';
import { IWhatsAppService, WhatsAppStatus } from '../../domain/interfaces/whatsapp-service.interface';

@Injectable()
export class ExternalWhatsAppService implements IWhatsAppService {
  private readonly logger = new Logger(ExternalWhatsAppService.name);
  private gatewayUrl = process.env.WHATSAPP_GATEWAY_URL || '';
  private gatewayToken = process.env.WHATSAPP_GATEWAY_TOKEN || '';

  async initialize(): Promise<void> {
    this.logger.log(`Inicializando ExternalWhatsAppService hacia: ${this.gatewayUrl}`);
  }

  async sendMessage(to: string, message: string): Promise<boolean> {
    if (!this.gatewayUrl) {
      this.logger.warn('No se ha configurado la URL del gateway externo (WHATSAPP_GATEWAY_URL).');
      return false;
    }
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (this.gatewayToken) {
        headers['Authorization'] = `Bearer ${this.gatewayToken}`;
      }

      // Limpiamos el número de caracteres no numéricos
      const formattedNumber = to.replace(/[^\d+]/g, '');

      const response = await fetch(`${this.gatewayUrl}/send`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          to: formattedNumber,
          number: formattedNumber, // Proveemos ambos para compatibilidad de gateways
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en el gateway externo: ${response.statusText}`);
      }
      return true;
    } catch (error: any) {
      this.logger.error(`Error al enviar mensaje vía gateway externo: ${error.message}`);
      return false;
    }
  }

  async getStatus(): Promise<WhatsAppStatus> {
    if (!this.gatewayUrl) {
      return {
        authenticated: false,
        status: 'DISCONNECTED',
        provider: 'external-api',
      };
    }
    try {
      const headers: Record<string, string> = {};
      if (this.gatewayToken) {
        headers['Authorization'] = `Bearer ${this.gatewayToken}`;
      }
      // Intentamos consultar la salud/estado del gateway si tiene endpoint /status
      const response = await fetch(`${this.gatewayUrl}/status`, { headers }).catch(() => null);
      
      if (response && response.ok) {
        const data = await response.json().catch(() => ({}));
        return {
          authenticated: data.authenticated ?? true,
          status: data.status ?? 'READY',
          provider: 'external-api',
          phoneNumber: data.phoneNumber || 'Gateway Remoto',
        };
      }

      return {
        authenticated: true,
        status: 'READY',
        provider: 'external-api',
        phoneNumber: 'Gateway Remoto (Activo)',
      };
    } catch (error) {
      return {
        authenticated: false,
        status: 'ERROR',
        provider: 'external-api',
      };
    }
  }

  async logout(): Promise<void> {
    if (!this.gatewayUrl) return;
    try {
      const headers: Record<string, string> = {};
      if (this.gatewayToken) {
        headers['Authorization'] = `Bearer ${this.gatewayToken}`;
      }
      await fetch(`${this.gatewayUrl}/logout`, { method: 'POST', headers }).catch(() => null);
    } catch (error: any) {
      this.logger.error(`Error al desvincular gateway remoto: ${error.message}`);
    }
  }
}
