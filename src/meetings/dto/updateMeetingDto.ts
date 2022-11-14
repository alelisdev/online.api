import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateMeetingDto } from './createMeetingDto';

export class UpdateMeetingDto extends PartialType(CreateMeetingDto) {
  @IsOptional() managerId: string;
}
