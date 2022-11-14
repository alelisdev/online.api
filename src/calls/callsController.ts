import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CallsService } from './callsService';
import { JwtAuthGuard } from '../auth/jwtAuthGuard';
import { CreateCallDto } from './dto/createCallDto';
import { UserRole } from '../shared/userRole';
import { UpdateCallDto } from './dto/updateCallDto';

@UseGuards(JwtAuthGuard)
@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  async create(@Req() req: any, @Body() createCallDto: CreateCallDto) {
    createCallDto['user_id'] = req.user.id;
    return this.callsService.create(createCallDto);
  }

  @Post('/getByPayload')
  findByPayload(@Req() req: any, @Body() data: any) {
    if (req.user.role === UserRole.MANAGER) {
      data['managerId'] = req.user.id;
    } else if (req.user.role === UserRole.SALE_REP) {
      data['salesRepId'] = req.user.id;
    }

    return this.callsService.findAllByPayload(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCallDto: UpdateCallDto) {
    return this.callsService.update(id, updateCallDto);
  }
}
