import { PaginationDto } from '../pagination/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class IngredientFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by name',
    type: String,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by alcoholic',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isAlcoholic?: boolean;
}
