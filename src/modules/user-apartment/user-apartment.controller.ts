import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { UserApartmentService } from './user-apartment.service';

import { CreateUserApartmentDto } from './dto/create-user-apartment.dto';
import { ApiTags } from '@nestjs/swagger';
import { LanguageDto } from '../../shared/types/enums';
import { MessageService } from '../../i18n/message.service';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { REQUEST } from '@nestjs/core';
import { Language } from '../../shared/decorators/language.decorator';

@UseGuards(IsLoggedIn)
@ApiTags('UserApartment')
@Controller('user-apartment')
export class UserApartmentController {
  constructor(
    private readonly userApartmentService: UserApartmentService,
    private readonly messageService: MessageService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @Post()
  async create(
    @Body() createUserApartmentDto: CreateUserApartmentDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.userApartmentService.create(
        createUserApartmentDto,
        language,
      );

      return {
        success: true,
        code: 201,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query() findUserApartmentDto: any,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.userApartmentService.findAll(
        findUserApartmentDto,
        language,
      );
      return {
        success: true,
        code: 200,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      const data = await this.userApartmentService.findOne(id, language);
      return {
        success: true,
        code: 200,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  // @SetRoles(UserApartmentRole.SYSTEM_ADMIN, UserApartmentRole.USER)
  @Delete()
  async remove(@Language() language: LanguageDto) {
    try {
      await this.userApartmentService.remove(this.request['user'].id, language);
      return {
        success: true,
        code: 200,
      };
    } catch (error) {
      throw error;
    }
  }
}
