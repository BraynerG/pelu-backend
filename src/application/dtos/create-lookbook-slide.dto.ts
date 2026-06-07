import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLookbookSlideDto {
  @IsString()
  @IsNotEmpty({ message: 'La URL de la imagen es requerida' })
  url: string;

  @IsString()
  @IsNotEmpty({ message: 'El título es requerido' })
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsNotEmpty({ message: 'La etiqueta (tag) es requerida' })
  tag: string;

  @IsString()
  @IsOptional()
  accent?: string;
}
