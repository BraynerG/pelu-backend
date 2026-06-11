export const WHATSAPP_SERVICE = 'WHATSAPP_SERVICE';

export interface WhatsAppStatus {
  authenticated: boolean;
  qrCode?: string; // Base64 data URL format
  status: 'DISCONNECTED' | 'CONNECTING' | 'QR_RECEIVED' | 'AUTHENTICATED' | 'READY' | 'ERROR';
  provider: 'local-webjs' | 'external-api' | 'mock-logger';
  phoneNumber?: string;
}

export interface IWhatsAppService {
  sendMessage(to: string, message: string): Promise<boolean>;
  getStatus(): Promise<WhatsAppStatus>;
  initialize(): Promise<void>;
  logout(): Promise<void>;
}
