import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './usersService';
import { TeamsModule } from '../teams/teamsModule';
import { UsersController } from './usersController';
import { User } from './entity/userEntity';
import { Team } from '../teams/entities/teamEntity';
import { SalesRep } from '../salesReps/entities/salesRepEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TeamsModule,
    TypeOrmModule.forFeature([Team]),
    TypeOrmModule.forFeature([SalesRep]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
