import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() username: string;
  @IsNotEmpty() password: string;
  @IsNotEmpty() @IsEmail() email: string;
  @IsNotEmpty() role?: string;
  @IsNotEmpty() status?: string;
  @IsOptional() @IsNotEmpty() teams?: any[];
  @IsOptional() teamId?: string;
}
