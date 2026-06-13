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
}
