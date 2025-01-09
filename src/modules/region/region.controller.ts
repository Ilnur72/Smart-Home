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
import { RegionService } from './region.service';

import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { LanguageDto, UserRole } from '../../shared/types/enums';
import { MessageService } from '../../i18n/message.service';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { SetRoles } from '../auth/set-roles.decorator';
import { HasRole } from '../../shared/guards/has-roles.guard';
import { DistrictService } from '../district/district.service';
import { RegionDto, ResponseRegionDto } from './dto/region.dto';
import { FindRegionDto } from './dto/find-region.dto';
import { Language } from '../../shared/decorators/language.decorator';
import { DistrictDto } from '../district/dto/district.dto';

@ApiTags('Region')
@Controller('region')
@ApiTags('Region')
// @ApiHeader({
//   name: 'accept-language',
//   required: false,
//   description: 'Language code (UZ, RU, EN). Defaults to EN if not provided',
// })
export class RegionController {
  constructor(
    private readonly regionService: RegionService,
    private readonly districtService: DistrictService,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(UserRole.SYSTEM_ADMIN)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Region successfully created',
    type: ResponseRegionDto,
  })
  @HttpCode(201)
  async create(
    @Body() createRegionDto: CreateRegionDto,
    @Language() language: LanguageDto,
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

  @ApiResponse({
    status: 200,
    description: 'List of Regions',
    type: ResponseRegionDto,
  })
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() findRegionDto: FindRegionDto,
    // @Language() language: LanguageDto,
    @Language() language: LanguageDto,
  ) {
    try {
      let data: RegionDto[] | DistrictDto[];
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
        // message: this.messageService.getMessage(
        //   'region',
        //   language,
        //   'region_fetched_successfully',
        // ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @SetRoles(UserRole.SYSTEM_ADMIN, UserRole.USER)
  @ApiResponse({
    status: 200,
    description: 'Single Region details',
    type: ResponseRegionDto,
  })
  @HttpCode(200)
  async findOne(@Param('id') id: string, @Language() language: LanguageDto) {
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
  @SetRoles(UserRole.SYSTEM_ADMIN)
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Region successfully updated',
  })
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateRegionDto: UpdateRegionDto,
    @Language() language: LanguageDto,
  ) {
    try {
      await this.regionService.update(id, updateRegionDto, language);
      return {
        success: true,
        code: 200,
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
  @SetRoles(UserRole.SYSTEM_ADMIN)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Region successfully deleted',
  })
  @HttpCode(200)
  async remove(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      await this.regionService.remove(id, language);
      return {
        success: true,
        code: 200,
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
