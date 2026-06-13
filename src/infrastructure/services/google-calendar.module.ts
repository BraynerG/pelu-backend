import { Module, Global } from '@nestjs/common';
import { GOOGLE_CALENDAR_SERVICE } from '../../domain/interfaces/google-calendar-service.interface';
import { GoogleCalendarService } from './google-calendar.service';
import { MockGoogleCalendarService } from './mock-google-calendar.service';

@Global()
@Module({
  providers: [
    GoogleCalendarService,
    MockGoogleCalendarService,
    {
      provide: GOOGLE_CALENDAR_SERVICE,
      useFactory: (
        real: GoogleCalendarService,
        mock: MockGoogleCalendarService,
      ) => {
        const hasEmail = !!process.env.GOOGLE_CLIENT_EMAIL;
        const hasPrivateKey = !!process.env.GOOGLE_PRIVATE_KEY;
        const hasOAuth = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);

        if (hasOAuth || (hasEmail && hasPrivateKey)) {
          console.log('[GoogleCalendarModule] Cargando proveedor REAL de Google Calendar.');
          return real;
        }

        console.log('[GoogleCalendarModule] Cargando proveedor SIMULADO (Mock) de Google Calendar.');
        return mock;
      },
      inject: [GoogleCalendarService, MockGoogleCalendarService],
    },
  ],
  exports: [GOOGLE_CALENDAR_SERVICE],
})
export class GoogleCalendarModule {}
