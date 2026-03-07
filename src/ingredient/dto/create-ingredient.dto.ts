import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsString({ message: 'Ingredient name must be a string' })
  @IsNotEmpty({ message: 'Ingredient name must be empty' })
  name: string;

  @IsString({ message: 'Ingredient description must be a string' })
  @IsOptional()
  description?: string;

  @IsBoolean({ message: 'isAlcoholic must be a boolean value true of false' })
  @IsNotEmpty()
  isAlcoholic: boolean;

  @IsString({ message: 'imageUrl must be a string' })
  @IsOptional()
  imageUrl: string;
}
