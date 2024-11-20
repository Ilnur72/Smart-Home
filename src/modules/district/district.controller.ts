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
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { ApiTags } from '@nestjs/swagger';
import { LanguageStatus, UserRole } from '../../shared/types/enums';
import { MessageService } from '../../i18n/message.service';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { SetRoles } from '../auth/set-roles.decorator';
import { HasRole } from '../../shared/guards/has-roles.guard';

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
  async create(
    @Body() createDistrictDto: CreateDistrictDto,
    @Headers('accept-language') language: LanguageStatus,
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

  @Get()
  async findAll(
    @Query() findDistrictDto: any,
    @Headers('accept-language') language: LanguageStatus,
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
  async findOne(
    @Param('id') id: string,
    @Headers('accept-language') language: LanguageStatus,
  ) {
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
  async update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
    @Headers('accept-language') language: LanguageStatus,
  ) {
    try {
      await this.districtService.update(id, updateDistrictDto, language);
      return {
        success: true,
        code: 204,
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
  async remove(
    @Param('id') id: string,
    @Headers('accept-language') language: LanguageStatus,
  ) {
    try {
      await this.districtService.remove(id, language);
      return {
        success: true,
        code: 204,
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
