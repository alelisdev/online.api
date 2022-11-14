import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { SalesRepsService } from './salesRepsService';
import { CreateSalesRepDto } from './dto/createSalesRepDto';
import { UpdateSalesRepDto } from './dto/updateSalesRepDto';
import { SalesRep } from './entities/salesRepEntity';
import { JwtAuthGuard } from '../auth/jwtAuthGuard';
import { UserRole } from '../shared/userRole';

@UseGuards(JwtAuthGuard)
@Controller('salesReps')
export class SalesRepsController {
  constructor(private readonly salesRepsService: SalesRepsService) {}

  @Post()
  create(@Body() createSalesRepDto: CreateSalesRepDto) {
    return this.salesRepsService.create(createSalesRepDto);
  }

  @Get()
  findAll() {
    return this.salesRepsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesRepsService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/getByPayload')
  findByPayload(@Req() req: any, @Body() data: Partial<SalesRep>) {
    if (req.user.role === UserRole.MANAGER) {
      data['managerId'] = req.user.id;
    } else if (req.user.role === UserRole.SALE_REP) {
      data['salesRepId'] = req.user.id;
    }

    return this.salesRepsService.findAllByPayload(data);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSalesRepDto: UpdateSalesRepDto,
  ) {
    return this.salesRepsService.update(id, updateSalesRepDto);
  }

  @Post('/delete')
  remove(@Body() params: any) {
    return this.salesRepsService.remove(params);
  }
}
