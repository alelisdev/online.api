import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/userEntity';
import { CreateUserDto } from './dto/userCreateDto';
import { LoginUserDto } from './dto/userLoginDto';
import { UserDto, UserUpdateDto } from './dto/userDto';
import { toUserDto } from '../shared/mapper';
import { comparePasswords } from '../shared/utils';
import { RegistrationStatus } from '../auth/interfaces/registrationStatusInterface';
import { TeamsService } from '../teams/teamsService';
import { UserRole } from '../shared/userRole';
import { Team } from '../teams/entities/teamEntity';
import { SalesRep } from '../salesReps/entities/salesRepEntity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private teamsService: TeamsService,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
    @InjectRepository(SalesRep) private salesRepRepo: Repository<SalesRep>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.teams', 'team')
      .leftJoinAndSelect('user.salesReps', 'sales_rep')
      .getMany();
  }

  async findOne(options?: any): Promise<UserDto> {
    const user = await this.userRepo.findOne(options);
    return toUserDto(user);
  }

  // async findByLogin({ username, password }: LoginUserDto): Promise<UserDto> {
  async findByLogin({ email, password, role }: LoginUserDto) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      // throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      return {
        success: false,
        message: 'Email not found',
      };
    }

    // compare passwords
    const areEqual = await comparePasswords(user.password, password);

    if (!areEqual) {
      // throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    if (user.status !== 'active') {
      return {
        success: false,
        message: 'Account is not active, please contact with admin.',
      };
    }

    // confirm admin
    if (role === UserRole.ADMIN && user.role !== UserRole.ADMIN) {
      return {
        success: false,
        message: 'Email is not correct',
      };
    } else if (
      role !== UserRole.ADMIN &&
      ![UserRole.SALE_REP, UserRole.MANAGER].includes(user.role)
    ) {
      return {
        success: false,
        message: 'Email is not correct',
      };
    }
    const result = {
      success: true,
      user: toUserDto(user),
    };

    return result;
  }

  async findOneByPayload(payload: any): Promise<UserDto> {
    return await this.userRepo.findOne({ where: payload });
  }

  async findAllByPayload(payload: any): Promise<User[]> {
    return await this.userRepo.find({ where: payload });
  }

  async create(userDto: CreateUserDto): Promise<RegistrationStatus> {
    const { username, password, email, role, status, teams } = userDto;

    // check if the user exists in the db
    const userInDb = await this.userRepo.findOne({
      where: { username },
    });

    if (userInDb) {
      // throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      return {
        success: false,
        message: 'User already exists',
      };
    }

    const user: User = this.userRepo.create({
      username,
      password,
      email,
      role,
      status,
    });
    await this.userRepo.save(user);
    if (teams) {
      teams.forEach(async (item) => {
        await this.teamsService.create({
          name: item.name,
          userId: user.id,
        });
      });
    }

    const response = {
      success: true,
      user: toUserDto(user),
    };

    return response;
  }

  async update(id: string, data: Partial<UserUpdateDto>) {
    if (data) {
      const {
        username,
        email,
        role,
        status,
        teams,
        teamId,
        avatar,
        background,
      } = data;
      const updatedUser = {
        username,
        email,
        role,
        status,
      };

      if (avatar) {
        updatedUser['avatar'] = avatar;
      }

      if (background) {
        updatedUser['background'] = background;
      }

      await this.userRepo.update({ id }, updatedUser);
      let oldTeams = await this.teamRepo.find({ userId: id });

      // Update teams for manager
      if (teams) {
        for (const item of teams) {
          if (item.id) {
            await this.teamsService.update(item.id, {
              name: item.name,
              userId: id,
            });
            oldTeams = oldTeams.filter((r) => r.id != item.id);
          } else {
            await this.teamsService.create({
              name: item.name,
              userId: id,
            });
          }
        }
        for (const item1 of oldTeams) {
          await this.salesRepRepo.delete({ teamId: item1.id });
          await this.teamRepo.delete({ id: item1.id });
        }
      }

      // Update sales_rep's team if teamId exists
      if (teamId) {
        const result = await this.salesRepRepo.update(
          { userId: id },
          { teamId: teamId },
        );
        if (result.affected === 0) {
          await this.salesRepRepo.insert({ userId: id, teamId: teamId });
        }
      }

      return {
        success: true,
        user: await this.userRepo.findOne({ id }),
        message: 'Updated the user',
      };
    }
    return {
      success: false,
      message: 'Update values are not defined',
    };
  }

  async delete(id: string) {
    const result = await this.userRepo.delete({ id });
    return {
      status: 200,
      data: result,
    };
  }
}
