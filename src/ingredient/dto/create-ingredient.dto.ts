import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateIngredientDto {
  @ApiProperty({
    example: 'Vodka',
    description: 'Name of ingredient',
  })
  @IsString({ message: 'Ingredient name must be a string' })
  @IsNotEmpty({ message: 'Ingredient name must be empty' })
  name: string;

  @ApiProperty({
    example: 'Bitter alcohol',
    description: 'Description of ingredient',
  })
  @IsString({ message: 'Ingredient description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Is ingredient alcoholic',
  })
  @IsBoolean({ message: 'isAlcoholic must be a boolean value true of false' })
  @IsNotEmpty()
  @Type(() => Boolean)
  isAlcoholic: boolean;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  imageUrl: string;
}
