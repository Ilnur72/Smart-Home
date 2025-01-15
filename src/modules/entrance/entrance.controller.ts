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
import { EntranceService } from './entrance.service';
import { CreateEntranceDto } from './dto/create-entrance.dto';
import { UpdateEntranceDto } from './dto/update-entrance.dto';
import { FindEntranceDto } from './dto/find-entrance.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LanguageDto, UserRole } from '../../shared/types/enums';
import { Language } from '../../shared/decorators/language.decorator';
import { SetRoles } from '../auth/set-roles.decorator';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { HasRole } from '../../shared/guards/has-roles.guard';
import { ResponseEntranceDto } from './dto/entrance.dto';
import { MessageService } from '../../i18n/message.service';

const { OPERATOR, OPERATOR_USER, SYSTEM_ADMIN } = UserRole;

@ApiTags('Entrance')
@Controller('entrance')
@UseGuards(IsLoggedIn)
export class EntranceController {
  constructor(
    private readonly entranceService: EntranceService,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(SYSTEM_ADMIN, OPERATOR)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Entrance successfully created',
    type: ResponseEntranceDto,
  })
  @HttpCode(201)
  async create(
    @Body() createEntranceDto: CreateEntranceDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.entranceService.create(
        createEntranceDto,
        language,
      );
      return {
        success: true,
        code: 201,
        data,
        message: this.messageService.getMessage(
          'entrance',
          language,
          'entrance_created_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @SetRoles(SYSTEM_ADMIN, OPERATOR, OPERATOR_USER)
  @ApiResponse({
    status: 200,
    description: 'List of Entrances',
    type: ResponseEntranceDto,
  })
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() findEntranceDto: FindEntranceDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.entranceService.findAll(
        findEntranceDto,
        language,
      );
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'entrance',
          language,
          'entrance_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @SetRoles(SYSTEM_ADMIN, OPERATOR, OPERATOR_USER)
  @ApiResponse({
    status: 200,
    description: 'Single Entrance details',
    type: ResponseEntranceDto,
  })
  @HttpCode(200)
  async findOne(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      const data = await this.entranceService.findOne(id, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'entrance',
          language,
          'entrance_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(SYSTEM_ADMIN, OPERATOR)
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Entrance successfully updated',
  })
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateEntranceDto: UpdateEntranceDto,
    @Language() language: LanguageDto,
  ) {
    try {
      await this.entranceService.update(id, updateEntranceDto, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'entrance',
          language,
          'entrance_updated_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(SYSTEM_ADMIN, OPERATOR)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Entrance successfully deleted',
  })
  @HttpCode(200)
  async remove(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      await this.entranceService.remove(id, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'entrance',
          language,
          'entrance_deleted_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
