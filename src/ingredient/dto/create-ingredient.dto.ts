import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  isAlcoholic: boolean;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Url of image of ingredient',
  })
  @IsString({ message: 'imageUrl must be a string' })
  @IsOptional()
  imageUrl: string;
}
