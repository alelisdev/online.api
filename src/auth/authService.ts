import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/userCreateDto';
import { RegistrationStatus } from './interfaces/registrationStatusInterface';
import { UsersService } from '../users/usersService';
import { MailService } from '../mail/mailService';
import { LoginStatus } from './interfaces/loginStatusInterface';
import { LoginUserDto } from '../users/dto/userLoginDto';
import { UserDto } from '../users/dto/userDto';
import { JwtPayload } from './interfaces/payloadInterface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus;

    try {
      const result: any = await this.usersService.create(userDto);

      if (result.success) {
        // send confirmation mail
        await this.mailService.sendUserConfirmation(userDto);
      }

      status = {
        success: result.success,
        message: result.message,
        user: result?.user,
      };
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }

    return status;
  }

  // async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    // find user in db
    const result: any = await this.usersService.findByLogin(loginUserDto);

    if (!result.success) {
      return {
        success: result.success,
        message: result.message,
        accessToken: null,
      };
    }

    // generate and sign token
    const token = this._createToken(result.user);

    return {
      success: result.success,
      user: result.user,
      accessToken: token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findOneByPayload({
      id: payload.sub,
      username: payload.username,
    });
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken(user: UserDto): any {
    const expiresIn = process.env.EXPIRES_IN;
    const jwtPayload: JwtPayload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(jwtPayload);

    return {
      expiresIn,
      accessToken,
    };
  }
}
