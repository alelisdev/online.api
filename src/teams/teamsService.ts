import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeamDto } from './dto/createTeamDto';
import { UpdateTeamDto } from './dto/updateTeamDto';
import { Repository } from 'typeorm';
import { Team } from './entities/teamEntity';

@Injectable()
export class TeamsService {
  constructor(@InjectRepository(Team) private teamRepo: Repository<Team>) {}

  async create(createTeamDto: CreateTeamDto) {
    try {
      const { name, userId } = createTeamDto;

      const team: Team = this.teamRepo.create({
        name,
        userId,
      });
      await this.teamRepo.save(team);

      return {
        success: true,
        data: team,
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
        data: await this.teamRepo.find(),
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
        data: await this.teamRepo.findOne(id),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async findAllByPayload(payload: any) {
    try {
      return {
        success: true,
        data: await this.teamRepo.find({
          relations: ['salesReps', 'salesReps.user'],
          where: payload,
        }),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    try {
      await this.teamRepo.update({ id }, updateTeamDto);
      return {
        success: true,
        data: await this.teamRepo.findOne(id),
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
      const result = await this.teamRepo.delete({ id });
      return {
        success: true,
        data: result,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
