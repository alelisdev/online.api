import { Controller, Body, Post, Get, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/userCreateDto';
import { RegistrationStatus } from './interfaces/registrationStatusInterface';
import { AuthService } from './authService';
import { LoginStatus } from './interfaces/loginStatusInterface';
import { LoginUserDto } from '../users/dto/userLoginDto';
import { JwtPayload } from './interfaces/payloadInterface';
import { JwtAuthGuard } from './jwtAuthGuard';
import { UserRole } from '../shared/userRole';
import { SalesRepsService } from '../salesReps/salesRepsService';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly salesRepService: SalesRepsService,
  ) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    if (createUserDto.role === UserRole.SALE_REP) {
      const params = {
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
        teamId: createUserDto.teamId,
      };
      return await this.salesRepService.create(params);
    } else {
      const result: RegistrationStatus = await this.authService.register(
        createUserDto,
      );
      // if (!result.success) {
      //   throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      // }

      return result;
    }
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto);
  }

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  public async testAuth(@Req() req: any): Promise<JwtPayload> {
    return req.user;
  }
}
