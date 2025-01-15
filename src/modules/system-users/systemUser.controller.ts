import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  // UseGuards,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { SystemUserService } from './systemUser.service';

import { CreateSystemUserDto } from './dto/create-systemUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { LanguageDto } from '../../shared/types/enums';
import { MessageService } from '../../i18n/message.service';
// import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { REQUEST } from '@nestjs/core';
// import { SetRoles } from '../auth/set-roles.decorator';
// import { HasRole } from '../../shared/guards/has-roles.guard';
import { Language } from '../../shared/decorators/language.decorator';
import { FindSystemUserDto } from './dto/find-systemUser.dto';
import { UpdateSystemUserDto } from './dto/update-systemUser.dto';
import { IsLoggedIn } from 'src/shared/guards/is-loggedin.guard';
import { HasRole } from 'src/shared/guards/has-roles.guard';

// @SetRoles(SystemUserRole.SYSTEM_ADMIN)
@UseGuards(IsLoggedIn, HasRole)
@ApiTags('SystemUser')
@Controller('system-user')
export class SystemUserController {
  constructor(
    private readonly systemService: SystemUserService,
    private readonly messageService: MessageService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @Post()
  async create(
    @Body() createSystemUserDto: CreateSystemUserDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.systemService.create(
        createSystemUserDto,
        language,
      );

      return {
        success: true,
        code: 201,
        data,
        message: this.messageService.getMessage(
          'system',
          language,
          'system_created_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query() findSystemUserDto: FindSystemUserDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.systemService.findAll(
        findSystemUserDto,
        language,
      );
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'system',
          language,
          'system_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  // @SetRoles(SystemUserRole.SYSTEM_ADMIN, SystemUserRole.USER)
  @Get('current')
  async findMe(@Language() language: LanguageDto) {
    try {
      const data = await this.systemService.findOne(
        this.request['system'].id,
        language,
      );
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'system',
          language,
          'system_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      const data = await this.systemService.findOne(id, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'system',
          language,
          'system_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  // @SetRoles(SystemUserRole.SYSTEM_ADMIN, SystemUserRole.USER)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() SystemUserDto: UpdateSystemUserDto,
    @Language() language: LanguageDto,
  ) {
    try {
      await this.systemService.update(id, SystemUserDto, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'system',
          language,
          'system_updated_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  // @SetRoles(SystemUserRole.SYSTEM_ADMIN, SystemUserRole.USER)
  @Delete(':id')
  async remove(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      await this.systemService.remove(id, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'system',
          language,
          'system_deleted_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
