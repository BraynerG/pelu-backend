import { Injectable } from '@nestjs/common';
import { IGoogleCalendarService } from '../../domain/interfaces/google-calendar-service.interface';
import { ReservationEntity } from '../../domain/entities/reservation.entity';

@Injectable()
export class MockGoogleCalendarService implements IGoogleCalendarService {
  private events = new Map<string, any>();

  async createEvent(
    reservation: ReservationEntity,
    serviceName: string,
    durationInMinutes: number,
  ): Promise<string | null> {
    const fakeId = `mock-event-${reservation.id}`;
    this.events.set(fakeId, { reservationId: reservation.id, serviceName, durationInMinutes });
    return fakeId;
  }

  async updateEvent(eventId: string, reservation: ReservationEntity, serviceName: string, durationInMinutes: number): Promise<boolean> {
    if (this.events.has(eventId)) {
      this.events.set(eventId, { reservationId: reservation.id, serviceName, durationInMinutes });
      return true;
    }
    return false;
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    console.log(`[MockGoogleCalendarService] Eliminando evento con ID: ${eventId}`);
    return true;
  }

  async getStatus(): Promise<{ connected: boolean; email?: string; provider?: string }> {
    return {
      connected: true,
      email: 'mock-admin@elegance.com',
      provider: 'Simulado (Mock)',
    };
  }

  async clearConfig(): Promise<boolean> {
    console.log('[MockGoogleCalendarService] Limpiando configuración simulada.');
    return true;
  }

  async saveTokens(tokens: any): Promise<void> {
    console.log('[MockGoogleCalendarService] Guardando tokens simulados:', tokens);
  }
}
