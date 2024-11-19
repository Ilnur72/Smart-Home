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
} from '@nestjs/common';
import { BuildingService } from './building.service';

import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { ApiTags } from '@nestjs/swagger';
import { LanguageStatus, UserRole } from '../../shared/types/enums';
import { MessageService } from '../../i18n/message.service';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { SetRoles } from '../auth/set-roles.decorator';
import { HasRole } from '../../shared/guards/has-roles.guard';

@ApiTags('Building')
@Controller('building')
export class BuildingController {
  constructor(
    private readonly buildingService: BuildingService,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(UserRole.ADMIN)
  @Post()
  async create(
    @Body() createBuildingDto: CreateBuildingDto,
    @Headers('accept-language') language: LanguageStatus,
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

  @Get()
  async findAll(
    @Query() findBuildingDto: any,
    @Headers('accept-language') language: LanguageStatus,
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
      console.log(error);

      throw error;
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('accept-language') language: LanguageStatus,
  ) {
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
  async update(
    @Param('id') id: string,
    @Body() updateBuildingDto: UpdateBuildingDto,
    @Headers('accept-language') language: LanguageStatus,
  ) {
    try {
      await this.buildingService.update(id, updateBuildingDto, language);
      return {
        success: true,
        code: 204,
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
  async remove(
    @Param('id') id: string,
    @Headers('accept-language') language: LanguageStatus,
  ) {
    try {
      await this.buildingService.remove(id, language);
      return {
        success: true,
        code: 204,
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
