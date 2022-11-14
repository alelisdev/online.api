import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UserDto {
  @IsNotEmpty() id: string;
  @IsNotEmpty() username: string;
  @IsNotEmpty() @IsEmail() email: string;
  @IsNotEmpty() @IsOptional() role: string;
  @IsNotEmpty() status: string;
  avatar?: string;
  background?: string;
  created_at?: Date;
}

export class UserUpdateDto {
  @IsNotEmpty() username: string;
  @IsNotEmpty() @IsEmail() email: string;
  @IsNotEmpty() role?: string;
  @IsNotEmpty() status?: string;
  @IsNotEmpty() teams?: any;
  avatar?: string;
  background?: string;
  @IsNotEmpty() @IsOptional() teamId?: string;
}
