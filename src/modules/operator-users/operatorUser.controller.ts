import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  Headers,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { OperatorUserService } from './operatorUser.service';

import { CreateOperatorUserDto } from './dto/create-operatorUser.dto';
import { UpdateOperatorUserDto } from './dto/update-operatorUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { LanguageStatus } from '../../shared/types/enums';
import { MessageService } from '../../i18n/message.service';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { REQUEST } from '@nestjs/core';
// import { SetRoles } from '../auth/set-roles.decorator';
import { HasRole } from '../../shared/guards/has-roles.guard';

// @SetRoles(OperatorUserRole.ADMIN)
@UseGuards(IsLoggedIn, HasRole)
@ApiTags('OperatorUser')
@Controller('operator')
export class OperatorUserController {
  constructor(
    private readonly operatorService: OperatorUserService,
    private readonly messageService: MessageService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @Post()
  async create(
    @Body() createOperatorUserDto: CreateOperatorUserDto,
    @Headers('accept-language') language: LanguageStatus,
  ) {
    try {
      const data = await this.operatorService.create(
        createOperatorUserDto,
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
    @Query() findOperatorUserDto: any,
    @Headers('accept-language') language: LanguageStatus,
  ) {
    try {
      const data = await this.operatorService.findAll(
        findOperatorUserDto,
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

  // @SetRoles(OperatorUserRole.ADMIN, OperatorUserRole.USER)
  @Get('current')
  async findMe(@Headers('accept-language') language: LanguageStatus) {
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
  async findOne(
    @Param('id') id: string,
    @Headers('accept-language') language: LanguageStatus,
  ) {
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

  // @SetRoles(OperatorUserRole.ADMIN, OperatorUserRole.USER)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOperatorUserDto: UpdateOperatorUserDto,
    @Headers('accept-language') language: LanguageStatus,
  ) {
    try {
      await this.operatorService.update(id, updateOperatorUserDto, language);
      return {
        success: true,
        code: 204,
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

  // @SetRoles(OperatorUserRole.ADMIN, OperatorUserRole.USER)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('accept-language') language: LanguageStatus,
  ) {
    try {
      await this.operatorService.remove(id, language);
      return {
        success: true,
        code: 204,
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