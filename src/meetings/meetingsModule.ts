import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingsService } from './meetingsService';
import { MeetingsController } from './meetingsController';
import { Meeting } from './entities/meetingEntity';
import { SalesRep } from '../salesReps/entities/salesRepEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting]),
    TypeOrmModule.forFeature([SalesRep]),
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
