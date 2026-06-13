import { ReservationEntity } from '../entities/reservation.entity';

export const GOOGLE_CALENDAR_SERVICE = 'GOOGLE_CALENDAR_SERVICE';

export interface IGoogleCalendarService {
  /**
   * Crea un evento en Google Calendar y devuelve su ID.
   * Si falla o no está configurado, devuelve null.
   */
  createEvent(
    reservation: ReservationEntity,
    serviceName: string,
    durationInMinutes: number,
  ): Promise<string | null>;

  /**
   * Elimina un evento de Google Calendar por su ID.
   * Devuelve true si se eliminó con éxito, false en caso contrario.
   */
  deleteEvent(eventId: string): Promise<boolean>;

  /**
   * Obtiene el estado de la conexión de Google Calendar.
   */
  getStatus(): Promise<{ connected: boolean; email?: string; provider?: string }>;

  /**
   * Elimina las credenciales de Google Calendar de la base de datos.
   */
  clearConfig(): Promise<boolean>;

  /**
   * Guarda los tokens de Google Calendar (accessToken, refreshToken, expiryDate) en la base de datos.
   */
  saveTokens(tokens: any): Promise<void>;
}
