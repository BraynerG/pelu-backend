import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { ReservationsModule } from './reservations/reservations.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { WhatsAppModule } from './infrastructure/services/whatsapp.module';

@Module({
  imports: [
    ServicesModule,
    ReservationsModule,
    AuthModule,
    UploadModule,
    WhatsAppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
