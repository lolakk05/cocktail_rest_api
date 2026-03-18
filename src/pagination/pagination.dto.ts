import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsPositive()
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ default: 'createdAt', description: 'order by field' })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';
}
