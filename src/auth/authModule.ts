import { Module } from '@nestjs/common';
import { AuthController } from './authController';
import { AuthService } from './authService';
import { UsersModule } from '../users/usersModule';
import { MailModule } from '../mail/mailModule';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwtStrategy';
import { ConfigService } from '@nestjs/config';
import { SalesRepsModule } from '../salesReps/salesRepsModule';

@Module({
  imports: [
    UsersModule,
    MailModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    SalesRepsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
