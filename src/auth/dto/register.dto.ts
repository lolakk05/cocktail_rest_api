import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'lolakk05',
    description: 'Login of user',
  })
  @IsString()
  @MinLength(3, { message: 'Login need to have at least 3 characters' })
  login!: string;

  @ApiProperty({
    example: 'lolakk05@gmail.com',
    description: 'Email of user',
  })
  @IsEmail({}, { message: 'Write correct email' })
  email!: string;

  @ApiProperty({
    example: 'lolakk05togoat',
    description: 'Password of user',
  })
  @IsString()
  @MinLength(6, { message: 'Password must contain atleast 6 characters' })
  password!: string;
}
