import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSalesRepDto {
  @IsNotEmpty() username: string;
  @IsNotEmpty() @IsEmail() email: string;
  @IsNotEmpty() password?: string;
  @IsNotEmpty() teamId: string;
}
