import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { Category, Unit } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateRatioDto {
  @ApiProperty({
    example: 1,
    description: 'Id of ingredient we want to add to drink',
  })
  @IsNumber()
  @IsNotEmpty()
  ingredientId: number;

  @ApiProperty({
    example: 1,
    description: 'Amount of ingredient we want to add to drink',
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  @ApiProperty({
    enum: Category,
    example: 'ML',
    description: 'Unit of ingredient we want to add to drink',
  })
  @IsNotEmpty()
  @IsEnum(Unit)
  unit: Unit;
}

export class CreateCocktailDto {
  @ApiProperty({
    example: 'Mojito',
    description: 'An unique name of cocktail',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'ALCOHOLIC',
    description: 'Should contain ALCOHOLIC or NON_ALCOHOLIC',
  })
  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @ApiProperty({
    example:
      'Pour 2 oz of vodka into glass. Add ice cubes. Garnish with lime wedge.',
    description: 'Information how to prepare drink',
  })
  @IsString()
  @IsNotEmpty()
  recipe: string;

  @ApiProperty({
    type: [CreateRatioDto],
    description: 'List of ingredients and amounts',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRatioDto)
  ratios: CreateRatioDto[];
}
