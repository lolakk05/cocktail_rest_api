import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Login to the application',
    description: 'Returns JWT token',
  })
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.login, signInDto.password);
  }

  @ApiOperation({
    summary: 'Register new user',
    description: 'Register new user with given data',
  })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
