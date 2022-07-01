import { HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionModule } from '@/modules/sessions/sessions.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    UsersModule,
    SessionModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expired },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
