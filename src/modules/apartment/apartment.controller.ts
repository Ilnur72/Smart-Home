import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { FindApartmentDto } from './dto/find-apartment.dto';
import { LanguageDto, UserRole } from '../../shared/types/enums';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Language } from '../../shared/decorators/language.decorator';
import { SetRoles } from '../auth/set-roles.decorator';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { HasRole } from '../../shared/guards/has-roles.guard';
import { ResponseApartmentDto } from './dto/apartment.dto';
import { MessageService } from '../../i18n/message.service';
const { OPERATOR_USER, SYSTEM_ADMIN, OPERATOR, USER } = UserRole;
@ApiTags('Apartment')
@Controller('apartment')
export class ApartmentController {
  constructor(
    private readonly apartmentService: ApartmentService,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(SYSTEM_ADMIN, OPERATOR, OPERATOR_USER)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Apartment successfully created',
    type: ResponseApartmentDto,
  })
  @HttpCode(201)
  async create(
    @Body() createApartmentDto: CreateApartmentDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.apartmentService.create(
        createApartmentDto,
        language,
      );
      return {
        success: true,
        code: 201,
        data,
        message: this.messageService.getMessage(
          'apartment',
          language,
          'apartment_created_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    description: 'List of Apartments',
    type: ResponseApartmentDto,
  })
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() findApartmentDto: FindApartmentDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.apartmentService.findAll(
        findApartmentDto,
        language,
      );
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'apartment',
          language,
          'apartment_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @SetRoles(SYSTEM_ADMIN, USER)
  @ApiResponse({
    status: 200,
    description: 'Single Apartment details',
    type: ResponseApartmentDto,
  })
  @HttpCode(200)
  async findOne(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      const data = await this.apartmentService.findOne(id, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'apartment',
          language,
          'apartment_fetched_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(SYSTEM_ADMIN)
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Apartment successfully updated',
  })
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateApartmentDto: UpdateApartmentDto,
    @Language() language: LanguageDto,
  ) {
    try {
      await this.apartmentService.update(id, updateApartmentDto, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'apartment',
          language,
          'apartment_updated_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(SYSTEM_ADMIN)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Apartment successfully deleted',
  })
  @HttpCode(200)
  async remove(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      await this.apartmentService.remove(id, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'apartment',
          language,
          'apartment_deleted_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
