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
import { UserService } from './user.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { LanguageDto } from '../../shared/types/enums';
import { MessageService } from '../../i18n/message.service';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { REQUEST } from '@nestjs/core';
// import { SetRoles } from '../auth/set-roles.decorator';
import { HasRole } from '../../shared/guards/has-roles.guard';
import { Language } from '../../shared/decorators/language.decorator';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(IsLoggedIn, HasRole)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.userService.create(createUserDto, language);

      return {
        success: true,
        code: 201,
        data,
        message: this.messageService.getMessage(
          'user',
          language,
          'user_created_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query() findUserDto: FindUserDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.userService.findAll(findUserDto, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'user',
          language,
          'user_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('current')
  async findMe(@Language() language: LanguageDto) {
    try {
      const data = await this.userService.findOne(
        this.request['user'].id,
        language,
      );
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'user',
          language,
          'user_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      const data = await this.userService.findOne(id, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'user',
          language,
          'user_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  // @SetRoles(UserRole.SYSTEM_ADMIN, UserRole.USER)
  @Put()
  async update(
    // @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Language() language: LanguageDto,
  ) {
    try {
      await this.userService.update(
        this.request['user'].id,
        updateUserDto,
        language,
      );
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'user',
          language,
          'user_updated_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  // @SetRoles(UserRole.SYSTEM_ADMIN, UserRole.USER)
  @Delete()
  async remove(@Language() language: LanguageDto) {
    try {
      await this.userService.remove(this.request['user'].id, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'user',
          language,
          'user_deleted_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
