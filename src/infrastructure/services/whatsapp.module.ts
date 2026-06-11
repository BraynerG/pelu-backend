import { Module, Global, OnModuleInit, Inject } from '@nestjs/common';
import { WHATSAPP_SERVICE } from '../../domain/interfaces/whatsapp-service.interface';
import type { IWhatsAppService } from '../../domain/interfaces/whatsapp-service.interface';
import { LocalWhatsAppService } from './local-whatsapp.service';
import { ExternalWhatsAppService } from './external-whatsapp.service';
import { MockWhatsAppService } from './mock-whatsapp.service';
import { WhatsAppController } from '../../presentation/controllers/whatsapp.controller';

@Global()
@Module({
  controllers: [WhatsAppController],
  providers: [
    LocalWhatsAppService,
    ExternalWhatsAppService,
    MockWhatsAppService,
    {
      provide: WHATSAPP_SERVICE,
      useFactory: (
        local: LocalWhatsAppService,
        external: ExternalWhatsAppService,
        mock: MockWhatsAppService,
      ) => {
        const provider = process.env.WHATSAPP_PROVIDER || '';
        
        if (provider === 'local-webjs') {
          return local;
        }
        if (provider === 'external-api') {
          return external;
        }
        if (provider === 'mock-logger') {
          return mock;
        }

        // Auto-detección del entorno
        if (process.env.VERCEL) {
          if (process.env.WHATSAPP_GATEWAY_URL) {
            return external;
          }
          return mock;
        }

        // Por defecto, usar el cliente local completo
        return local;
      },
      inject: [LocalWhatsAppService, ExternalWhatsAppService, MockWhatsAppService],
    },
  ],
  exports: [WHATSAPP_SERVICE],
})
export class WhatsAppModule implements OnModuleInit {
  constructor(
    @Inject(WHATSAPP_SERVICE)
    private readonly whatsappService: IWhatsAppService,
  ) {}

  async onModuleInit() {
    // Inicializa el servicio resuelto automáticamente
    await this.whatsappService.initialize().catch((err) => {
      console.error('Error al inicializar el servicio de WhatsApp en modulo init:', err.message);
    });
  }
}
