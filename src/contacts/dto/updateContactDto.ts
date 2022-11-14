import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateContactDto } from './createContactDto';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsNotEmpty() username: string;
  @IsNotEmpty() @IsEmail() email: string;
  @IsNotEmpty() userId: string;
  avatar?: string;
}
