import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID, IsNumber } from 'class-validator';

export class AdminCreateReservationDto {
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

  @IsUUID('4', { message: 'El ID de la variante debe ser un UUID válido' })
  @IsOptional()
  variantId?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber({}, { message: 'La duración debe ser un número' })
  @IsOptional()
  durationOverride?: number;
}

export class UpdateReservationDto {
  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsUUID('4', { message: 'El ID del servicio debe ser un UUID válido' })
  @IsOptional()
  serviceId?: string;

  @IsUUID('4', { message: 'El ID de la variante debe ser un UUID válido' })
  @IsOptional()
  variantId?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber({}, { message: 'La duración debe ser un número' })
  @IsOptional()
  durationOverride?: number;
}
