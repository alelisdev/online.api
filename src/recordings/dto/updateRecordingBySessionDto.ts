import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateRecordingDto } from './createRecordingDto';

export class UpdateRecordingBySessionDto extends PartialType(
  CreateRecordingDto,
) {
  @IsNotEmpty() session_id: string;
  @IsNotEmpty() file_path: string;
}
