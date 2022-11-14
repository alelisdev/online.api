import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preset } from './entities/presetEntity';
import { PresetsController } from './presetsController';
import { PresetsService } from './presetsService';

@Module({
  imports: [TypeOrmModule.forFeature([Preset])],
  controllers: [PresetsController],
  providers: [PresetsService],
  exports: [PresetsService],
})
export class PresetsModule {}
