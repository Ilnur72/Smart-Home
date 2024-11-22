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
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { LanguageDto, UserRole } from '../../shared/types/enums';
import { MessageService } from '../../i18n/message.service';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { SetRoles } from '../auth/set-roles.decorator';
import { HasRole } from '../../shared/guards/has-roles.guard';
import { ResponseDistrictDto } from './dto/district.dto';
// import { FindDistrictDto } from './dto/find-district.dto';
import { Language } from '../../shared/decorators/language.decorator';
@ApiTags('District')
@Controller('district')
export class DistrictController {
  constructor(
    private readonly districtService: DistrictService,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(UserRole.ADMIN)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'District successfully created',
    type: ResponseDistrictDto,
  })
  @HttpCode(201)
  async create(
    @Body() createDistrictDto: CreateDistrictDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.districtService.create(
        createDistrictDto,
        language,
      );

      return {
        success: true,
        code: 201,
        data,
        message: this.messageService.getMessage(
          'district',
          language,
          'district_created_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    description: 'List of Districts',
    type: ResponseDistrictDto,
  })
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() findDistrictDto: any,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.districtService.findAll(
        findDistrictDto,
        language,
      );
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'district',
          language,
          'district_fetched_successfully',
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
    description: 'Single District details',
    type: ResponseDistrictDto,
  })
  @HttpCode(200)
  async findOne(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      const data = await this.districtService.findOne(id, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'district',
          language,
          'district_fetched_successfully',
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
    description: 'District successfully updated',
  })
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
    @Language() language: LanguageDto,
  ) {
    try {
      await this.districtService.update(id, updateDistrictDto, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'district',
          language,
          'district_updated_successfully',
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
    description: 'District successfully deleted',
  })
  @HttpCode(200)
  async remove(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      await this.districtService.remove(id, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'district',
          language,
          'district_deleted_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
