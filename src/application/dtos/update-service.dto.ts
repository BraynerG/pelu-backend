import { IsString, IsOptional, IsNumber, Min, IsArray } from 'class-validator';

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(5, { message: 'La duración mínima es de 5 minutos' })
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  steps?: string[];
}
