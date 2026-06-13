import { Injectable } from '@nestjs/common';
import { IGoogleCalendarService } from '../../domain/interfaces/google-calendar-service.interface';
import { ReservationEntity } from '../../domain/entities/reservation.entity';

@Injectable()
export class MockGoogleCalendarService implements IGoogleCalendarService {
  async createEvent(
    reservation: ReservationEntity,
    serviceName: string,
    durationInMinutes: number,
  ): Promise<string | null> {
    const mockId = `mock-event-${Math.random().toString(36).substring(2, 11)}`;
    console.log(`[MockGoogleCalendarService] Creando evento para la reserva ${reservation.id}:`);
    console.log(`  Cliente: ${reservation.customerName}`);
    console.log(`  Ritual: ${serviceName}`);
    console.log(`  Fecha: ${reservation.date}`);
    console.log(`  Duración: ${durationInMinutes} minutos`);
    console.log(`  Retornando ID simulado: ${mockId}`);
    return mockId;
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
