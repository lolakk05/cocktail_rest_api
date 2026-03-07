import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category, Unit } from '@prisma/client';

class CreateRatioDto {
  @IsNumber()
  @IsNotEmpty()
  ingredientId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  @IsEnum(Unit)
  unit: Unit;
}

export class CreateCocktailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @IsString()
  @IsNotEmpty()
  recipe: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRatioDto)
  ratios: CreateRatioDto[];
}
