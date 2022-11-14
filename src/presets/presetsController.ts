import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdatePresetDto } from './dto/updatePresetDto';
import { PresetsService } from './presetsService';
import { CreatePresetDto } from './dto/createPresetDto';
import { Preset } from './entities/presetEntity';

@Controller('presets')
export class PresetsController {
  constructor(private readonly presetsService: PresetsService) {}

  @Post()
  create(@Body() createPresetDto: CreatePresetDto) {
    return this.presetsService.create(createPresetDto);
  }

  @Get()
  findAll() {
    return this.presetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presetsService.findOne(id);
  }

  @Post('/getByPayload')
  findByPayload(@Body() data: Partial<Preset>) {
    return this.presetsService.findAllByPayload(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdatePresetDto) {
    return this.presetsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presetsService.remove(id);
  }
}
