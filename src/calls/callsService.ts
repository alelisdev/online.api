import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCallDto } from './dto/createCallDto';
import { Call } from './entities/callEntity';
import { ConfigService } from '@nestjs/config';
import { UpdateCallDto } from './dto/updateCallDto';
import { Meeting } from '../meetings/entities/meetingEntity';
import { Team } from '../teams/entities/teamEntity';
import { SalesRep } from '../salesReps/entities/salesRepEntity';
import { User } from '../users/entity/userEntity';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call) private callRepo: Repository<Call>,
    private configService: ConfigService,
  ) {}

  async create(createCallDto: CreateCallDto) {
    try {
      const call: Call = this.callRepo.create(createCallDto);
      await this.callRepo.save(call);

      return {
        success: true,
        call: call,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async findAllByPayload(payload: any) {
    let callsRep: any;
    try {
      if (payload.salesRepId) {
        const user_id = payload.salesRepId;
        delete payload.salesRepId;
        callsRep = this.callRepo
          .createQueryBuilder('calls')
          .leftJoinAndMapOne(
            'calls.user',
            User,
            'user',
            'calls.user_id = user.id',
          )
          .leftJoinAndMapOne(
            'calls.meeting',
            Meeting,
            'meeting',
            'meeting.id = calls.meeting_id',
          )
          .where({ user_id });
      } else if (payload.managerId) {
        const user_id = payload.managerId;
        delete payload.managerId;
        callsRep = this.callRepo
          .createQueryBuilder('calls')
          .leftJoinAndMapOne(
            'calls.user',
            User,
            'user',
            'calls.user_id = user.id',
          )
          .leftJoinAndMapOne(
            'calls.meeting',
            Meeting,
            'meeting',
            'meeting.id = calls.meeting_id',
          )
          .leftJoinAndSelect(
            SalesRep,
            'sales_rep',
            'sales_rep.userId = meeting.userId',
          )
          .leftJoinAndSelect(
            Team,
            'team',
            'team.id = sales_rep.teamId AND team.userId = :managerId',
            { managerId: user_id },
          );
        if (payload.teamId && payload.teamId !== 'all') {
          callsRep.where('team.id = :teamId', { teamId: payload.teamId });
        }

        callsRep = callsRep.where('team.userId is not null');
      }
      callsRep = await callsRep.getMany();
      return {
        success: true,
        data: callsRep,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async update(id: string, updateCallDto: UpdateCallDto) {
    try {
      await this.callRepo.update({ id }, updateCallDto);
      return {
        success: true,
        call: await this.callRepo.findOne(id),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
