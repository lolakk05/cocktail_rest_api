import { PaginationDto } from '../pagination/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '@prisma/client';

export class CocktailFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by category',
    enum: Category,
  })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiPropertyOptional({
    description: 'Filter by name',
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by user',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional({ description: 'Filter by ingredient' })
  @IsOptional()
  @IsString()
  ingredientName?: string;
}
