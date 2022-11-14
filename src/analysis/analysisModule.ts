import { forwardRef, Module } from '@nestjs/common';
import { WebSocketModule } from 'nestjs-websocket';
import { AnalysisService } from './analysisService';
import { RecordingsModule } from '../recordings/recordingsModule';
import { ConfigService } from '@nestjs/config';

//TODO use config module here
//TODO to run container on mac simply use the next address `ws://host.docker.internal:5050` or `ws://localhost:5050`

@Module({
  imports: [
    forwardRef(() => RecordingsModule),
    WebSocketModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        url: `${config.get('WEBSOCKETS_URL')}:${config.get('WEBSOCKETS_PORT')}`,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AnalysisService],
  exports: [AnalysisService],
})
export class AnalysisModule {}
