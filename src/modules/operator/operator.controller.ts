import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { OperatorService } from './operator.service';

import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { ApiTags } from '@nestjs/swagger';
import { LanguageDto } from '../../shared/types/enums';
import { MessageService } from '../../i18n/message.service';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { REQUEST } from '@nestjs/core';
// import { SetRoles } from '../auth/set-roles.decorator';
import { HasRole } from '../../shared/guards/has-roles.guard';
import { Language } from '../../shared/decorators/language.decorator';
import { FindOperatorDto } from './dto/find-operator.dto';

// @SetRoles(OperatorRole.SYSTEM_ADMIN)
@UseGuards(IsLoggedIn, HasRole)
@ApiTags('Operator')
@Controller('operator')
export class OperatorController {
  constructor(
    private readonly operatorService: OperatorService,
    private readonly messageService: MessageService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @Post()
  async create(
    @Body() createOperatorDto: CreateOperatorDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.operatorService.create(
        createOperatorDto,
        language,
      );

      return {
        success: true,
        code: 201,
        data,
        message: this.messageService.getMessage(
          'operator',
          language,
          'operator_created_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query() findOperatorDto: FindOperatorDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.operatorService.findAll(
        findOperatorDto,
        language,
      );
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'operator',
          language,
          'operator_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  // @SetRoles(OperatorRole.SYSTEM_ADMIN, OperatorRole.USER)
  @Get('current')
  async findMe(@Language() language: LanguageDto) {
    try {
      const data = await this.operatorService.findOne(
        this.request['operator'].id,
        language,
      );
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'operator',
          language,
          'operator_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      const data = await this.operatorService.findOne(id, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'operator',
          language,
          'operator_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  // @SetRoles(OperatorRole.SYSTEM_ADMIN, OperatorRole.USER)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOperatorDto: UpdateOperatorDto,
    @Language() language: LanguageDto,
  ) {
    try {
      await this.operatorService.update(id, updateOperatorDto, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'operator',
          language,
          'operator_updated_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  // @SetRoles(OperatorRole.SYSTEM_ADMIN, OperatorRole.USER)
  @Delete(':id')
  async remove(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      await this.operatorService.remove(id, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'operator',
          language,
          'operator_deleted_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
