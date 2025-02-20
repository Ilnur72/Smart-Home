import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { LogCallService } from './logCall.service';
import { CreateLogCallDto } from './dto/create-log-call.dto';

@Controller('call-log')
export class LogCallController {
  constructor(private readonly logCallService: LogCallService) {}

  @Post()
  async create(@Body() createLogCallDto: CreateLogCallDto) {
    return this.logCallService.create(createLogCallDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.logCallService.findAll(query);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.logCallService.remove(id);
  }
}
