import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as QRCode from 'qrcode';
import { IWhatsAppService, WhatsAppStatus } from '../../domain/interfaces/whatsapp-service.interface';

@Injectable()
export class LocalWhatsAppService implements IWhatsAppService, OnApplicationShutdown {
  private readonly logger = new Logger(LocalWhatsAppService.name);
  private client: Client | null = null;
  private connectionStatus: WhatsAppStatus['status'] = 'DISCONNECTED';
  private isAuthenticated = false;
  private qrCodeBase64?: string;
  private phoneNumber?: string;

  async initialize(): Promise<void> {
    if (this.client) {
      this.logger.log('El cliente de WhatsApp local ya está instanciado.');
      return;
    }

    this.logger.log('Inicializando cliente Local de WhatsApp Web (Puppeteer)...');
    this.connectionStatus = 'CONNECTING';

    const puppeteerOptions: any = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
      ],
    };

    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      puppeteerOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    } else if (process.platform === 'linux') {
      puppeteerOptions.executablePath = '/usr/bin/chromium';
    }

    try {
      this.client = new Client({
        authStrategy: new LocalAuth({
          dataPath: './.wwebjs_auth',
        }),
        puppeteer: puppeteerOptions,
      });

      this.client.on('qr', async (qr) => {
        this.connectionStatus = 'QR_RECEIVED';
        this.isAuthenticated = false;
        try {
          this.qrCodeBase64 = await QRCode.toDataURL(qr);
          this.logger.log('Nuevo código QR de WhatsApp generado y listo para escanear.');
        } catch (err: any) {
          this.logger.error('Error al generar código QR en Base64:', err.message);
        }
      });

      this.client.on('authenticated', () => {
        this.logger.log('Sesión de WhatsApp autenticada exitosamente.');
        this.isAuthenticated = true;
        this.connectionStatus = 'AUTHENTICATED';
        this.qrCodeBase64 = undefined;
      });

      this.client.on('auth_failure', (msg) => {
        this.logger.error(`Fallo en autenticación de WhatsApp: ${msg}`);
        this.connectionStatus = 'ERROR';
        this.isAuthenticated = false;
        this.qrCodeBase64 = undefined;
      });

      this.client.on('ready', () => {
        this.logger.log('Conexión con WhatsApp lista y activa.');
        this.connectionStatus = 'READY';
        this.isAuthenticated = true;
        this.qrCodeBase64 = undefined;

        const wid = (this.client as any).info?.wid;
        if (wid) {
          this.phoneNumber = wid.user;
        }
      });

      this.client.on('disconnected', (reason) => {
        this.logger.warn(`Cliente de WhatsApp desvinculado. Razón: ${reason}`);
        this.connectionStatus = 'DISCONNECTED';
        this.isAuthenticated = false;
        this.qrCodeBase64 = undefined;
        this.phoneNumber = undefined;
      });

      await this.client.initialize();
    } catch (err: any) {
      this.logger.error(`Fallo crítico al arrancar Puppeteer / WhatsApp Web: ${err.message}`);
      this.connectionStatus = 'ERROR';
    }
  }

  async sendMessage(to: string, message: string): Promise<boolean> {
    if (!this.client || this.connectionStatus !== 'READY') {
      this.logger.warn('No se puede enviar el mensaje de WhatsApp. El cliente no está en estado READY.');
      return false;
    }
    try {
      const cleanNumber = to.replace(/[^\d]/g, '');
      const chatId = `${cleanNumber}@c.us`;
      await this.client.sendMessage(chatId, message);
      this.logger.log(`Mensaje de WhatsApp enviado correctamente a: ${chatId}`);
      return true;
    } catch (err: any) {
      this.logger.error(`Error al enviar mensaje a ${to}: ${err.message}`);
      return false;
    }
  }

  async getStatus(): Promise<WhatsAppStatus> {
    return {
      authenticated: this.isAuthenticated,
      qrCode: this.qrCodeBase64,
      status: this.connectionStatus,
      provider: 'local-webjs',
      phoneNumber: this.phoneNumber,
    };
  }

  async logout(): Promise<void> {
    if (this.client) {
      try {
        this.logger.log('Desvinculando cliente de WhatsApp local...');
        await this.client.logout().catch(() => null);
        await this.client.destroy().catch(() => null);
        this.client = null;
        this.connectionStatus = 'DISCONNECTED';
        this.isAuthenticated = false;
        this.qrCodeBase64 = undefined;
        this.phoneNumber = undefined;
        // Re-inicializamos en segundo plano para habilitar un nuevo QR
        this.initialize();
      } catch (err: any) {
        this.logger.error(`Error al desvincular cliente de WhatsApp: ${err.message}`);
      }
    }
  }

  async onApplicationShutdown() {
    if (this.client) {
      this.logger.log('Cerrando Puppeteer por apagado de la aplicación...');
      await this.client.destroy().catch(() => null);
    }
  }
}
