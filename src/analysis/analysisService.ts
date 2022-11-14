import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectWebSocketProvider } from 'nestjs-websocket';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { RecordingsService } from '../recordings/recordingsService';

@Injectable()
export class AnalysisService implements OnModuleInit {
  onModuleInit() {
    this.checkConnection();
    setTimeout(() => {
      this.ws.send('hello from nest');
    }, 4000);
  }
  constructor(
    @Inject(forwardRef(() => RecordingsService))
    private readonly recordingsService: RecordingsService,
    @InjectWebSocketProvider()
    private readonly ws: ReconnectingWebSocket,
  ) {
    this.ws.addEventListener('open', () => {
      console.log('connection established');
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.ws.addEventListener('message', async (e) => {
      console.log(`Data received: ${e.data} `);
      if (e.data.includes('key')) {
        const mlDataString = e.data;
        await this.updateFromWebsockets(mlDataString);
        setTimeout(() => {
          this.ws.send('ping');
        }, 3000);
      } else {
        setTimeout(() => {
          this.ws.send('ping');
        }, 2000);
      }
    });
    this.ws.addEventListener('close', () => {
      console.log('closed');
    });
  }

  public checkConnection = () => {
    console.log(this.ws.readyState);
    return this.ws.readyState;
  };

  public triggerVideoProcessing = (key, id) => {
    if (this.ws.OPEN) {
      this.ws.send(JSON.stringify({ key: key, id: id }));
    } else {
      console.log('something went wrong');
    }
    console.log('triggered');
  };

  public updateFromWebsockets = async (pythonStr: string) => {
    const respObj = JSON.parse(pythonStr);
    await this.recordingsService.updateFromWebsockets(respObj);
  };
}
