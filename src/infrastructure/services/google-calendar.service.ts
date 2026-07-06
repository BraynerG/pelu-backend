import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { IGoogleCalendarService } from '../../domain/interfaces/google-calendar-service.interface';
import { ReservationEntity } from '../../domain/entities/reservation.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class GoogleCalendarService implements IGoogleCalendarService {
  private calendar: any = null;
  private calendarId: string;
  private timeZone: string;

  constructor(private readonly prisma: PrismaService) {
    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    this.timeZone = process.env.APP_TIMEZONE || 'Europe/Madrid';
  }

  private async getCalendarClient(): Promise<any> {
    if (this.calendar) {
      return this.calendar;
    }

    const email = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    // 1. Intentar buscar en la base de datos la configuración de OAuth2
    try {
      const config = await this.prisma.googleCalendarConfig.findFirst();
      if (config && config.refreshToken && clientId && clientSecret) {
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
        oauth2Client.setCredentials({
          refresh_token: config.refreshToken,
          access_token: config.accessToken || undefined,
        });

        // Registrar callback para guardar automáticamente el token de acceso cuando Google lo refresque
        oauth2Client.on('tokens', async (tokens) => {
          if (tokens.access_token) {
            try {
              await this.prisma.googleCalendarConfig.update({
                where: { id: config.id },
                data: {
                  accessToken: tokens.access_token,
                  expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
                },
              });
            } catch (updateErr: any) {
              console.error('Error al actualizar tokens refrescados en la BD:', updateErr.message);
            }
          }
        });

        this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        this.calendarId = config.calendarId || process.env.GOOGLE_CALENDAR_ID || 'primary';
        return this.calendar;
      }
    } catch (err: any) {
      console.error('Error al resolver credenciales de Google Calendar desde BD:', err.message);
    }

    // 2. Fallback a Cuenta de Servicio (JWT) desde variables de entorno
    if (email && privateKey) {
      try {
        const formattedKey = privateKey.replace(/\\n/g, '\n');
        const auth = new google.auth.JWT({
          email: email,
          key: formattedKey,
          scopes: ['https://www.googleapis.com/auth/calendar'],
        });
        this.calendar = google.calendar({ version: 'v3', auth });
        this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
        return this.calendar;
      } catch (err: any) {
        console.error('Error al inicializar Google Calendar JWT desde .env:', err.message);
      }
    }

    return null;
  }

  async saveTokens(tokens: any): Promise<void> {
    const existing = await this.prisma.googleCalendarConfig.findFirst();
    const data = {
      accessToken: tokens.access_token || null,
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
    };

    if (existing) {
      await this.prisma.googleCalendarConfig.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await this.prisma.googleCalendarConfig.create({
        data: {
          ...data,
          calendarId: 'primary',
        },
      });
    }
    // Forzar reinicio de la instancia en memoria
    this.calendar = null;
  }

  async clearConfig(): Promise<boolean> {
    try {
      await this.prisma.googleCalendarConfig.deleteMany();
      this.calendar = null;
      return true;
    } catch (err: any) {
      console.error('Error al limpiar configuración de Google Calendar:', err.message);
      return false;
    }
  }

  async getStatus(): Promise<{ connected: boolean; email?: string; provider?: string }> {
    const client = await this.getCalendarClient();
    if (!client) {
      return { connected: false };
    }

    try {
      const res = await client.calendars.get({ calendarId: 'primary' });
      return {
        connected: true,
        email: res.data.id || undefined,
        provider: 'OAuth2 (Dinámico)',
      };
    } catch (err: any) {
      const config = await this.prisma.googleCalendarConfig.findFirst();
      if (config && config.refreshToken) {
        return { connected: false, provider: 'OAuth2 (Invalido / Expirado)' };
      }

      if (process.env.GOOGLE_CLIENT_EMAIL) {
        return {
          connected: true,
          email: process.env.GOOGLE_CLIENT_EMAIL,
          provider: 'Cuenta de Servicio',
        };
      }

      return { connected: false };
    }
  }

  async createEvent(
    reservation: ReservationEntity,
    serviceName: string,
    durationInMinutes: number,
  ): Promise<string | null> {
    const calendar = await this.getCalendarClient();
    if (!calendar) {
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

      const res = await calendar.events.insert({
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
    const calendar = await this.getCalendarClient();
    if (!calendar) {
      console.warn('Google Calendar Client no inicializado. Omitiendo eliminación de evento.');
      return false;
    }

    try {
      await calendar.events.delete({
        calendarId: this.calendarId,
        eventId: eventId,
      });
      return true;
    } catch (error: any) {
      if (error.status === 410 || error.code === 410) {
        console.warn(`El evento ${eventId} ya no existe en Google Calendar.`);
        return true;
      }
      console.error(`Error al eliminar evento ${eventId} de Google Calendar:`, error.message);
      return false;
    }
  }

  async updateEvent(
    eventId: string,
    reservation: ReservationEntity,
    serviceName: string,
    durationInMinutes: number,
  ): Promise<boolean> {
    const calendar = await this.getCalendarClient();
    if (!calendar) {
      console.warn('Google Calendar Client no inicializado. Omitiendo actualización de evento.');
      return false;
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

      await calendar.events.update({
        calendarId: this.calendarId,
        eventId: eventId,
        requestBody: event,
      });

      return true;
    } catch (error: any) {
      console.error(`Error al actualizar evento ${eventId} de Google Calendar:`, error.message);
      return false;
    }
  }
}
