import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordingsService } from './recordingsService';
import { RecordingsController } from './recordingsController';
import { Recording } from './entities/recordingEntity';
import { AnalysisModule } from '../analysis/analysisModule';
import { Transcription } from './entities/transcriptionEntity';
import { TranscriptionsService } from './transcriptionService';

@Module({
  imports: [
    AnalysisModule,
    TypeOrmModule.forFeature([Recording]),
    TypeOrmModule.forFeature([Transcription]),
  ],
  controllers: [RecordingsController],
  providers: [RecordingsService, TranscriptionsService],
  exports: [RecordingsService],
})
export class RecordingsModule {}
