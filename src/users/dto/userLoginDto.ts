import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  // @IsNotEmpty()
  // readonly username: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly role?: string;
}
