import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { ReservationsModule } from './reservations/reservations.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { WhatsAppModule } from './infrastructure/services/whatsapp.module';
import { GoogleCalendarModule } from './infrastructure/services/google-calendar.module';

@Module({
  imports: [
    ServicesModule,
    ReservationsModule,
    AuthModule,
    UploadModule,
    WhatsAppModule,
    GoogleCalendarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
