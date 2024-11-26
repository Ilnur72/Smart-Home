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
import { BuildingService } from './building.service';

import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LanguageDto, UserRole } from '../../shared/types/enums';
import { MessageService } from '../../i18n/message.service';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { SetRoles } from '../auth/set-roles.decorator';
import { HasRole } from '../../shared/guards/has-roles.guard';
import { FindBuildingDto } from './dto/find-building.dto';
import { ResponseBuildingDto } from './dto/building.dto';
import { Language } from '../../shared/decorators/language.decorator';

@ApiTags('Building')
@Controller('building')
export class BuildingController {
  constructor(
    private readonly buildingService: BuildingService,
    private readonly messageService: MessageService,
  ) {}

  // @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(UserRole.ADMIN)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Building successfully created',
    type: ResponseBuildingDto,
  })
  @HttpCode(201)
  async create(
    @Body() createBuildingDto: CreateBuildingDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.buildingService.create(
        createBuildingDto,
        language,
      );

      return {
        success: true,
        code: 201,
        data,
        message: this.messageService.getMessage(
          'building',
          language,
          'building_created_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  // @SetRoles(UserRole.ADMIN, UserRole.USER)
  @ApiResponse({
    status: 200,
    description: 'List of Buildings',
    type: ResponseBuildingDto,
  })
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() findBuildingDto: FindBuildingDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.buildingService.findAll(
        findBuildingDto,
        language,
      );
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'building',
          language,
          'building_fetched_successfully',
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
    description: 'Single Building details',
    type: ResponseBuildingDto,
  })
  @HttpCode(200)
  async findOne(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      const data = await this.buildingService.findOne(id, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'building',
          language,
          'building_fetched_successfully',
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
    description: 'Building successfully updated',
  })
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateBuildingDto: UpdateBuildingDto,
    @Language() language: LanguageDto,
  ) {
    try {
      await this.buildingService.update(id, updateBuildingDto, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'building',
          language,
          'building_updated_successfully',
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
    description: 'Building successfully deleted',
  })
  @HttpCode(200)
  async remove(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      await this.buildingService.remove(id, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'building',
          language,
          'building_deleted_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
