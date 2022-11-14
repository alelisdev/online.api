import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCallDto {
  @IsNotEmpty() @IsOptional() meeting_id: string;
  @IsNotEmpty() @IsOptional() user_id: string;
  @IsNotEmpty() @IsOptional() started_at: string;
  @IsNotEmpty() @IsOptional() ended_at: string;
  @IsNotEmpty() @IsOptional() client: string;
}
