import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './createTeamDto';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {}
