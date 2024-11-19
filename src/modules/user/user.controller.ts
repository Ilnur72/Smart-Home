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
import { UserService } from './user.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { LanguageStatus } from '../../shared/types/enums';
import { MessageService } from '../../i18n/message.service';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { REQUEST } from '@nestjs/core';
// import { SetRoles } from '../auth/set-roles.decorator';
import { HasRole } from '../../shared/guards/has-roles.guard';

// @SetRoles(UserRole.ADMIN)
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
    @Headers('accept-language') language: LanguageStatus,
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
    @Query() findUserDto: any,
    @Headers('accept-language') language: LanguageStatus,
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

  // @SetRoles(UserRole.ADMIN, UserRole.USER)
  @Get('current')
  async findMe(@Headers('accept-language') language: LanguageStatus) {
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
  async findOne(
    @Param('id') id: string,
    @Headers('accept-language') language: LanguageStatus,
  ) {
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

  // @SetRoles(UserRole.ADMIN, UserRole.USER)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('accept-language') language: LanguageStatus,
  ) {
    try {
      await this.userService.update(id, updateUserDto, language);
      return {
        success: true,
        code: 204,
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

  // @SetRoles(UserRole.ADMIN, UserRole.USER)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('accept-language') language: LanguageStatus,
  ) {
    try {
      await this.userService.remove(id, language);
      return {
        success: true,
        code: 204,
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
