import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallsService } from './callsService';
import { CallsController } from './callsController';
import { Call } from './entities/callEntity';

//TODO - figure out why we need to store this - it identical data with meetings

@Module({
  imports: [TypeOrmModule.forFeature([Call])],
  controllers: [CallsController],
  providers: [CallsService],
  exports: [CallsService],
})
export class CallsModule {}
