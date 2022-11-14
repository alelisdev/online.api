import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Meeting } from './entities/meetingEntity';
import { MeetingsService } from './meetingsService';
import { CreateMeetingDto } from './dto/createMeetingDto';
import { UpdateMeetingDto } from './dto/updateMeetingDto';
import { JwtAuthGuard } from '../auth/jwtAuthGuard';
import { Public } from '../auth/publicDecorator';
import { UserRole } from '../shared/userRole';

@UseGuards(JwtAuthGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  create(@Req() req: any, @Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingsService.create(req, createMeetingDto);
  }

  @Get()
  findAll() {
    return this.meetingsService.findAll();
  }

  @Public()
  @Get('client/:id')
  findOneByClient(@Param('id') id: string) {
    return this.meetingsService.findOne(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(id);
  }

  @Post('/getByPayload')
  findByPayload(@Req() req: any, @Body() data: Partial<Meeting>) {
    if (req.user.role === UserRole.MANAGER) {
      data['managerId'] = req.user.id;
    } else if (req.user.role === UserRole.SALE_REP) {
      data['salesRepId'] = req.user.id;
    }

    return this.meetingsService.findAllByPayload(data);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
  ) {
    return this.meetingsService.update(req.user, id, updateMeetingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingsService.remove(id);
  }
}
