import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private database: DatabaseService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.database.user.findUnique({
      where: { login: username },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const passwordMatches = await bcrypt.compare(pass, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: user.userId,
      username: user.login,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findOneByLogin(
      registerDto.login,
    );

    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    const newUser = await this.database.user.create({
      data: {
        login: registerDto.login,
        email: registerDto.email,
        password: hashedPassword,
      },
    });
    const { password, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  }
}
