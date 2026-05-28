import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del cliente es requerido' })
  customerName: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono del cliente es requerido' })
  customerPhone: string;

  @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de la reserva es requerida' })
  date: string;

  @IsUUID('4', { message: 'El ID del servicio debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del servicio es requerido' })
  serviceId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
