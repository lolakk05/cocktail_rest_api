import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'lolakk05',
    description: 'Login of user',
  })
  @IsString()
  login: string;

  @ApiProperty({
    example: 'lolakk05togoat',
    description: 'Password of user',
  })
  @IsString()
  password: string;
}
