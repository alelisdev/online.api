import { PartialType } from '@nestjs/mapped-types';
import { CreateCallDto } from './createCallDto';

export class UpdateCallDto extends PartialType(CreateCallDto) {}
