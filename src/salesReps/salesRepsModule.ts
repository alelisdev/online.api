import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesRepsService } from './salesRepsService';
import { SalesRepsController } from './salesRepsController';
import { SalesRep } from './entities/salesRepEntity';
import { UsersModule } from '../users/usersModule';

@Module({
  imports: [TypeOrmModule.forFeature([SalesRep]), UsersModule],
  controllers: [SalesRepsController],
  providers: [SalesRepsService],
  exports: [SalesRepsService],
})
export class SalesRepsModule {}
