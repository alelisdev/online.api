import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateSalesRepDto } from './createSalesRepDto';

export class UpdateSalesRepDto extends PartialType(CreateSalesRepDto) {
  @IsNotEmpty() userId: string;
}
