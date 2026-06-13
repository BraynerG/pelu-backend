import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { IGoogleCalendarService } from '../../domain/interfaces/google-calendar-service.interface';
import { ReservationEntity } from '../../domain/entities/reservation.entity';

@Injectable()
export class GoogleCalendarService implements IGoogleCalendarService {
  private calendar: any;
  private calendarId: string;
  private timeZone: string;

  constructor() {
    const email = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    this.timeZone = process.env.APP_TIMEZONE || 'Europe/Madrid';

    if (clientId && clientSecret && refreshToken) {
      try {
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
        oauth2Client.setCredentials({ refresh_token: refreshToken });
        this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      } catch (err: any) {
        console.error('Error al inicializar la autenticación de Google Calendar OAuth2:', err.message);
      }
    } else if (email && privateKey) {
      try {
        const formattedKey = privateKey.replace(/\\n/g, '\n');
        const auth = new google.auth.JWT({
          email: email,
          key: formattedKey,
          scopes: ['https://www.googleapis.com/auth/calendar'],
        });
        this.calendar = google.calendar({ version: 'v3', auth });
      } catch (err: any) {
        console.error('Error al inicializar la autenticación de Google Calendar JWT:', err.message);
      }
    } else {
      console.warn('Google Calendar Service se instanció sin credenciales de OAuth2 ni Cuenta de Servicio en .env.');
    }
  }

  async createEvent(
    reservation: ReservationEntity,
    serviceName: string,
    durationInMinutes: number,
  ): Promise<string | null> {
    if (!this.calendar) {
      console.warn('Google Calendar Client no inicializado. Omitiendo creación de evento.');
      return null;
    }

    try {
      const startDate = new Date(reservation.date);
      const endDate = new Date(startDate.getTime() + durationInMinutes * 60 * 1000);

      const descriptionLines = [
        `Cliente: ${reservation.customerName}`,
        `Teléfono: ${reservation.customerPhone}`,
        `Ritual: ${serviceName}`,
        reservation.notes ? `Notas: ${reservation.notes}` : null,
        `ID de Reserva: ${reservation.id}`,
      ].filter(Boolean);

      const event = {
        summary: `Reserva: ${serviceName} - ${reservation.customerName}`,
        description: descriptionLines.join('\n'),
        start: {
          dateTime: startDate.toISOString(),
          timeZone: this.timeZone,
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: this.timeZone,
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 30 },
            { method: 'email', minutes: 120 },
          ],
        },
      };

      const res = await this.calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: event,
      });

      return res.data.id || null;
    } catch (error: any) {
      console.error('Error al crear evento en Google Calendar:', error.message);
      return null;
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    if (!this.calendar) {
      console.warn('Google Calendar Client no inicializado. Omitiendo eliminación de evento.');
      return false;
    }

    try {
      await this.calendar.events.delete({
        calendarId: this.calendarId,
        eventId: eventId,
      });
      return true;
    } catch (error: any) {
      // Si el evento ya fue eliminado en Google Calendar directamente, lo consideramos éxito
      if (error.status === 410 || error.code === 410) {
        console.warn(`El evento ${eventId} ya no existe en Google Calendar.`);
        return true;
      }
      console.error(`Error al eliminar evento ${eventId} de Google Calendar:`, error.message);
      return false;
    }
  }
}
