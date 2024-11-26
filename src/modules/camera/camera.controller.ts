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
import { CameraService } from './camera.service';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import { FindCameraDto } from './dto/find-camera.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LanguageDto, UserRole } from '../../shared/types/enums';
import { Language } from '../../shared/decorators/language.decorator';
import { SetRoles } from '../auth/set-roles.decorator';
import { IsLoggedIn } from '../../shared/guards/is-loggedin.guard';
import { HasRole } from '../../shared/guards/has-roles.guard';
import { ResponseCameraDto } from './dto/camera.dto';
import { MessageService } from '../../i18n/message.service';

@ApiTags('Camera')
@Controller('camera')
export class CameraController {
  constructor(
    private readonly cameraService: CameraService,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(IsLoggedIn, HasRole)
  @SetRoles(UserRole.ADMIN)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Camera successfully created',
    type: ResponseCameraDto,
  })
  @HttpCode(201)
  async create(
    @Body() createCameraDto: CreateCameraDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.cameraService.create(createCameraDto, language);
      return {
        success: true,
        code: 201,
        data,
        message: this.messageService.getMessage(
          'camera',
          language,
          'camera_created_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    description: 'List of Cameras',
    type: ResponseCameraDto,
  })
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() findCameraDto: FindCameraDto,
    @Language() language: LanguageDto,
  ) {
    try {
      const data = await this.cameraService.findAll(findCameraDto, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'camera',
          language,
          'camera_fetched_successfully',
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
    description: 'Single Camera details',
    type: ResponseCameraDto,
  })
  @HttpCode(200)
  async findOne(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      const data = await this.cameraService.findOne(id, language);
      return {
        success: true,
        code: 200,
        data,
        message: this.messageService.getMessage(
          'camera',
          language,
          'camera_fetched_successfully',
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
    description: 'Camera successfully updated',
  })
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateCameraDto: UpdateCameraDto,
    @Language() language: LanguageDto,
  ) {
    try {
      await this.cameraService.update(id, updateCameraDto, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'camera',
          language,
          'camera_updated_successfully',
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
    description: 'Camera successfully deleted',
  })
  @HttpCode(200)
  async remove(@Param('id') id: string, @Language() language: LanguageDto) {
    try {
      await this.cameraService.remove(id, language);
      return {
        success: true,
        code: 200,
        message: this.messageService.getMessage(
          'camera',
          language,
          'camera_deleted_successfully',
        ),
      };
    } catch (error) {
      throw error;
    }
  }
}
