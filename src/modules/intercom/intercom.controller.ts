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
  HttpCode,
} from '@nestjs/common';
import { IntercomService } from './intercom.service';
import { CreateIntercomDto } from './dto/create-intercom.dto';
import { UpdateIntercomDto } from './dto/update-intercom.dto';
import { FindIntercomDto } from './dto/find-intercom.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LanguageDto, UserRole } from '../../shared/types/enums';
import { Language } from 'src/shared/decorators/language.decorator';
import { SetRoles } from '../auth/set-roles.decorator';
import { IsLoggedIn } from 'src/shared/guards/is-loggedin.guard';
import { HasRole } from 'src/shared/guards/has-roles.guard';
import { ResponseIntercomDto } from './dto/intercom.dto';
import { MessageService } from 'src/i18n/message.service';

@ApiTags('Intercom')
@Controller('intercom')
export class IntercomController {
  constructor(
    private readonly intercomService: IntercomService,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(UserRole.ADMIN)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Intercom successfully created',
    type: ResponseIntercomDto,
  })
  @HttpCode(201)
  async create(
    @Body() createIntercomDto: CreateIntercomDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.intercomService.create(
        createIntercomDto,
        language,
      );
      return {
        success: true,
        code: 201,
        data,
        message: this.messageService.getMessage(
          'intercom',
          language,
          'intercom_created_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    description: 'List of Intercoms',
    type: ResponseIntercomDto,
  })
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() findIntercomDto: FindIntercomDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.intercomService.findAll(
        findIntercomDto,
        language,
      );
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'intercom',
          language,
          'intercom_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @SetRoles(UserRole.ADMIN, UserRole.USER)
  @ApiResponse({
    status: 200,
    description: 'Single Intercom details',
    type: ResponseIntercomDto,
  })
  @HttpCode(200)
  async findOne(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      const data = await this.intercomService.findOne(id, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'intercom',
          language,
          'intercom_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(UserRole.ADMIN)
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Intercom successfully updated',
  })
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateIntercomDto: UpdateIntercomDto,
    @Language() language: LanguageDto,
  ) {
    try {
      await this.intercomService.update(id, updateIntercomDto, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'intercom',
          language,
          'intercom_updated_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(UserRole.ADMIN)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Intercom successfully deleted',
  })
  @HttpCode(200)
  async remove(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      await this.intercomService.remove(id, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'intercom',
          language,
          'intercom_deleted_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
