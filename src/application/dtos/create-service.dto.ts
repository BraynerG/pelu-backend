import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceVariantDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la variante es requerido' })
  name: string;

  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @IsNumber()
  @Min(5, { message: 'La duración mínima es de 5 minutos' })
  duration: number;
}

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del servicio es requerido' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @IsNumber()
  @Min(5, { message: 'La duración mínima es de 5 minutos' })
  duration: number;

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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceVariantDto)
  variants?: CreateServiceVariantDto[];
}
