import { PartialType } from '@nestjs/mapped-types';
import { CreatePresetDto } from './createPresetDto';

export class UpdatePresetDto extends PartialType(CreatePresetDto) {}
