import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      //only for development to make things easier
      signOptions: { expiresIn: '7d' },
    }),
  ],
  exports: [AuthModule],
})
export class AuthModule {}
