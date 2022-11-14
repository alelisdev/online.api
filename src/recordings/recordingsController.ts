import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RecordingsService } from './recordingsService';
import { JwtAuthGuard } from '../auth/jwtAuthGuard';
import { CreateRecordingDto } from './dto/createRecordingDto';
import { UpdateRecordingBySessionDto } from './dto/updateRecordingBySessionDto';
import { Public } from '../auth/publicDecorator';
import { Recording } from './entities/recordingEntity';
import { TranscriptionsService } from './transcriptionService';
import { Transcription } from './entities/transcriptionEntity';

@UseGuards(JwtAuthGuard)
@Controller('recordings')
export class RecordingsController {
  constructor(
    private readonly recordingsService: RecordingsService,
    private readonly transcriptionsService: TranscriptionsService,
  ) {}

  @Post()
  async create(
    @Req() req: any,
    @Body() createRecordingDto: CreateRecordingDto,
  ) {
    createRecordingDto['user_id'] = req.user.id;
    return this.recordingsService.create(createRecordingDto);
  }

  @Public()
  @Post('/addFileBySession')
  addFileBySession(
    @Body() updateRecordingBySessionDto: UpdateRecordingBySessionDto,
  ) {
    return this.recordingsService.updateFromAws(updateRecordingBySessionDto);
  }

  @Post('/getAllByMeetingId')
  findByMeetingId(@Body() data: Partial<Recording>) {
    return this.recordingsService.findAllByMeetingId(data);
  }

  @Post('/getTranscriptionsByMeeting')
  transcriptionsByMeetingId(@Body() data: Partial<Transcription>) {
    return this.transcriptionsService.findAllByMeetingId(data);
  }

  @Post('/addTranslation')
  addTranslations(@Body() data: Partial<Recording>) {
    return this.transcriptionsService.addTranslations(data);
  }
}
