import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {Role, User} from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  login: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
