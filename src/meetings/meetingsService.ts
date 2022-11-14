import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from './entities/meetingEntity';
import { CreateMeetingDto } from './dto/createMeetingDto';
import { UpdateMeetingDto } from './dto/updateMeetingDto';
import { SalesRep } from '../salesReps/entities/salesRepEntity';
import { Team } from '../teams/entities/teamEntity';
import { UserRole } from '../shared/userRole';
import { User } from '../users/entity/userEntity';
import { Call } from '../calls/entities/callEntity';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting) private meetingRepo: Repository<Meeting>,
    @InjectRepository(SalesRep) private salesRepRepo: Repository<SalesRep>,
  ) {}

  async create(req: any, createMeetingDto: CreateMeetingDto) {
    try {
      const { title, description, start, end, userId } = createMeetingDto;

      const params = {
        title,
        description,
        start: new Date(start),
        end: new Date(end),
        userId,
      };

      if (req.user.role === UserRole.SALE_REP) {
        const saleRep: SalesRep = await this.salesRepRepo.findOne({
          relations: ['team'],
          where: { userId: req.user.id },
        });
        if (saleRep) {
          params['salesRepId'] = saleRep.id;
          params['teamId'] = saleRep.team.id;
        }
      } else {
        if (createMeetingDto.teamId) {
          params['teamId'] = createMeetingDto.teamId;
        }
        if (createMeetingDto.salesRepId) {
          params['salesRepId'] = createMeetingDto.salesRepId;
        }
      }

      const meeting: Meeting = this.meetingRepo.create(params);
      await this.meetingRepo.save(meeting);

      return {
        success: true,
        meeting: meeting,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async findAll() {
    try {
      return {
        success: true,
        data: await this.meetingRepo.find(),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async findOne(id: string) {
    try {
      return {
        success: true,
        data: await this.meetingRepo.findOne(id),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async findAllByPayload(payload: any) {
    let meetingRep: any;
    try {
      if (payload.salesRepId) {
        const userId = payload.salesRepId;
        delete payload.salesRepId;

        const saleRep: SalesRep = await this.salesRepRepo.findOne({
          where: { userId: userId },
        });
        meetingRep = this.meetingRepo
          .createQueryBuilder('meeting')
          .innerJoin(SalesRep, 'sales_rep', 'sales_rep.id = meeting.salesRepId')
          .where('meeting.salesRepId = :salesRepId', {
            salesRepId: saleRep.id,
          });
      } else if (payload.managerId) {
        const managerId = payload.managerId;
        delete payload.managerId;
        meetingRep = this.meetingRepo
          .createQueryBuilder('meeting')
          .leftJoin(
            Team,
            'team',
            'team.id = meeting.teamId AND team.userId = :managerId',
          )
          .where('(team.userId IS NOT NULL OR meeting.userId = :managerId)', {
            managerId: managerId,
          });
      }

      if (payload.teamId) {
        meetingRep = meetingRep.andWhere('meeting.teamId = :teamId', {
          teamId: payload.teamId,
        });
      }

      if (payload.upcoming) {
        meetingRep = meetingRep
          .leftJoinAndSelect(Call, 'call', 'call.meeting_id = meeting.id')
          .andWhere('call.id is null');
      }

      if (payload.start) {
        const _localTime = new Date(payload.start);
        meetingRep = meetingRep.andWhere('start >= :start', {
          start: _localTime,
        });
      }
      meetingRep = await meetingRep.orderBy('meeting.start', 'ASC').getMany();
      return {
        success: true,
        data: meetingRep,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async update(
    user: Partial<User>,
    id: string,
    updateMeetingDto: UpdateMeetingDto,
  ) {
    let saleRep: SalesRep | null;
    try {
      if (user.role === UserRole.SALE_REP) {
        saleRep = await this.salesRepRepo.findOne({
          relations: ['team'],
          where: { userId: user.id },
        });
      } else if (user.role === UserRole.MANAGER) {
        if (updateMeetingDto.salesRepId)
          saleRep = await this.salesRepRepo.findOne({
            relations: ['team'],
            where: { id: updateMeetingDto.salesRepId },
          });
      }

      if (saleRep) {
        updateMeetingDto['salesRepId'] = saleRep.id;
        updateMeetingDto['teamId'] = saleRep.team.id;
      }

      await this.meetingRepo.update({ id }, updateMeetingDto);
      return {
        success: true,
        data: await this.meetingRepo.findOne(id),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async remove(id: string) {
    try {
      await this.meetingRepo.delete({ id });
      return {
        success: true,
      };
    } catch (e) {
      console.info(e);
      return {
        success: false,
        message: e,
      };
    }
  }
}
