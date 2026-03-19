import { PaginationDto } from '../pagination/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UserFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by login',
    type: String,
  })
  @IsOptional()
  @IsString()
  login?: string;

  @ApiPropertyOptional({
    description: 'Filter by email',
    type: String,
  })
  @IsOptional()
  @IsString()
  email?: string;
}
