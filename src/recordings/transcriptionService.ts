import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transcription } from './entities/transcriptionEntity';

//TODO make this a separate module?

@Injectable()
export class TranscriptionsService {
  constructor(
    @InjectRepository(Transcription)
    private translationsRepo: Repository<Transcription>,
  ) {}

  //TODO Refactor here
  async addTranslations(data: Partial<Transcription>) {
    try {
      const transcription: Transcription = await this.translationsRepo.create({
        meeting_id: data.meeting_id,
        confidence: data.confidence,
        transcription: data.transcription,
        isTalkingPoint: data.isTalkingPoint,
      });
      await this.translationsRepo.save(transcription);
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async findAllByMeetingId(data: any) {
    try {
      return {
        success: true,
        transcriptions: await this.translationsRepo.find({
          where: { meeting_id: data['meeting_id'] },
        }),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
