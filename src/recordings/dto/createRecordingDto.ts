import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRecordingDto {
  @IsNotEmpty() @IsOptional() meeting_id: string;
  @IsNotEmpty() session_id: string;
  @IsNotEmpty() @IsOptional() user_id: string;
}
