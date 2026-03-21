import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserAdminDto extends PartialType(CreateUserDto) {
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
