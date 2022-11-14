import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './appController';
import { AppService } from './appService';
import { UsersModule } from './users/usersModule';
import { AuthModule } from './auth/authModule';
import { ContactsModule } from './contacts/contactsModule';
import { MeetingsModule } from './meetings/meetingsModule';
import { TeamsModule } from './teams/teamsModule';
import { SalesRepsModule } from './salesReps/salesRepsModule';
import { RecordingsModule } from './recordings/recordingsModule';
import { CallsModule } from './calls/callsModule';
import * as path from 'path';
import { AnalysisModule } from './analysis/analysisModule';
import { PresetsModule } from './presets/presetsModule';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(process.cwd(), !ENV ? '.env' : `.env.${ENV}`),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    AuthModule,
    UsersModule,
    ContactsModule,
    MeetingsModule,
    TeamsModule,
    AnalysisModule,
    PresetsModule,
    SalesRepsModule,
    RecordingsModule,
    CallsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
