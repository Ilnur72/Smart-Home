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
import { RegionService } from './region.service';

import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { ApiTags } from '@nestjs/swagger';
import { LanguageStatus, UserRole } from '../../shared/types/enums';
import { MessageService } from '../../i18n/message.service';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { SetRoles } from '../auth/set-roles.decorator';
import { HasRole } from '../../shared/guards/has-roles.guard';
import { DistrictService } from '../district/district.service';

@ApiTags('Region')
@Controller('region')
export class RegionController {
  constructor(
    private readonly regionService: RegionService,
    private readonly districtService: DistrictService,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(UserRole.ADMIN)
  @Post()
  async create(
    @Body() createRegionDto: CreateRegionDto,
    @Headers('accept-language') language: LanguageStatus,
  ) {
    try {
      const data = await this.regionService.create(createRegionDto, language);

      return {
        success: true,
        code: 201,
        data,
        message: this.messageService.getMessage(
          'region',
          language,
          'region_created_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query() findRegionDto: any,
    @Headers('accept-language') language: LanguageStatus,
  ) {
    try {
      let data;
      if (findRegionDto.region_id) {
        data = await this.districtService.findAll(
          {
            filters: { region_id: findRegionDto.region_id },
          },
          language,
        );
      } else data = await this.regionService.findAll(findRegionDto, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'region',
          language,
          'region_fetched_successfully',
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
      const data = await this.regionService.findOne(id, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'region',
          language,
          'region_fetched_successfully',
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
    @Body() updateRegionDto: UpdateRegionDto,
    @Headers('accept-language') language: LanguageStatus,
  ) {
    try {
      await this.regionService.update(id, updateRegionDto, language);
      return {
        success: true,
        code: 204,
        message: this.messageService.getMessage(
          'region',
          language,
          'region_updated_successfully',
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
      await this.regionService.remove(id, language);
      return {
        success: true,
        code: 204,
        message: this.messageService.getMessage(
          'region',
          language,
          'region_deleted_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
