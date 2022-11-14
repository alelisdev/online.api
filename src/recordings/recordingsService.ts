import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecordingDto } from './dto/createRecordingDto';
import { Recording } from './entities/recordingEntity';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { UpdateRecordingBySessionDto } from './dto/updateRecordingBySessionDto';
import { AnalysisService } from '../analysis/analysisService';

@Injectable()
export class RecordingsService {
  constructor(
    @InjectRepository(Recording) private recordingRepo: Repository<Recording>,
    private configService: ConfigService,
    private analysisService: AnalysisService,
  ) {
    this.s3Client = new S3();
    this.s3Client.config.update({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  private s3Client: S3;

  async create(createRecordingDto: CreateRecordingDto) {
    try {
      const { meeting_id, session_id, user_id } = createRecordingDto;

      const recording: Recording = this.recordingRepo.create({
        meeting_id,
        session_id,
        user_id,
      });
      await this.recordingRepo.save(recording);

      return {
        success: true,
        recording: recording,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  //This method will trigger the analysis module and return result of the ML analysis

  async processVideo(recording: Partial<Recording>) {
    try {
      const filePath = recording.file_path;
      const recordingID = recording.id;
      const meetingID = recording.meeting_id;
      const path = `recordings/${meetingID}/${filePath}`;
      await this.analysisService.triggerVideoProcessing(path, recordingID);
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

  //TODO refactor and add types here

  async updateFromWebsockets(respObj) {
    try {
      const attentionLvl: string = respObj.attentionLvl;
      const recordID = respObj.id;
      console.log('rec', recordID, 'att', attentionLvl);
      await this.recordingRepo.update(
        { id: recordID },
        { attentionLvl: attentionLvl },
      );
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

  async updateFromAws(
    updateRecordingBySessionDto: UpdateRecordingBySessionDto,
  ) {
    try {
      const recording = await this.recordingRepo.findOne({
        where: {
          session_id: updateRecordingBySessionDto.session_id,
        },
      });
      const updatedRecording = await this.recordingRepo.save({
        ...recording,
        ...updateRecordingBySessionDto,
      });
      await this.processVideo(updatedRecording);
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

  async findAllByPayload(data: Partial<Recording>) {
    try {
      return {
        success: true,
        recording: await this.recordingRepo.find({
          where: { session_id: data['session_id'] },
        }),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async findAllByMeetingId(data: Partial<Recording>) {
    try {
      const recordsArr: Recording[] = await this.recordingRepo.find({
        where: { meeting_id: data['meeting_id'] },
      });
      //TODO use config service here
      const bucket_name = 'affectcx-recordings';
      const prefix = 'recordings';
      //This method gets file list for s3 and should be executed before any operations with files
      await this.getFileListFromS3(bucket_name, prefix);

      //This part will return a valid public url for each recording
      const processedRecords = await Promise.all(
        recordsArr.map(async (rec) => {
          const url = await this.addRecordLinkFromAws(rec, bucket_name);
          return { ...rec, url: url };
        }),
      );
      return {
        success: true,
        recording: processedRecords,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
  private async getFileListFromS3(bucket, prefix) {
    await this.s3Client.listObjects({ Bucket: bucket, Marker: prefix }, () => {
      console.log('worked');
    });
    return true;
  }

  private async addRecordLinkFromAws(rec: Partial<Recording>, bucket) {
    //TODO add method for generating filepath for aws
    const filePath = rec.file_path;
    const meetingID = rec.meeting_id;
    const path = `recordings/${meetingID}/${filePath}`;
    return this.s3Client.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: path,
      Expires: 60000,
    });
  }
}
