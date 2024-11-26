import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { Camera } from './entities/camera.entity';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import { FindCameraDto } from './dto/find-camera.dto';
import { LanguageDto } from '../../shared/types/enums';

@Injectable()
export class CameraService {
  constructor(
    @InjectRepository(Camera)
    private cameraRepository: Repository<Camera>,
    private readonly messageService: MessageService,
  ) {}

  async create(createCameraDto: CreateCameraDto, language?: LanguageDto) {
    try {
      const newCamera = this.cameraRepository.create(createCameraDto);
      return await this.cameraRepository.save(newCamera);
    } catch (error) {
      throw new HttpException(
        this.messageService.getMessage(
          'camera',
          language,
          'failed_to_create_camera',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(findCameraDto: FindCameraDto, language?: LanguageDto) {
    try {
      const {
        page = { offset: 1, limit: 10 },
        search,
        filters,
      } = findCameraDto;
      const existing = this.cameraRepository
        .createQueryBuilder('camera')
        .where('camera.is_deleted = :is_deleted', {
          is_deleted: filters?.is_deleted ?? false,
        });

      if (search) {
        existing.where(
          'camera.model ILIKE :search OR camera.ip_address ILIKE :search',
          {
            search: `%${search}%`,
          },
        );
      }

      if (filters) {
        existing.andWhere(filters);

        // if (filters.building_id) {
        //   existing.andWhere('camera.building_id = :building_id', {
        //     building_id: filters.building_id,
        //   });
        // }
        // if (filters.status) {
        //   existing.andWhere('camera.status = :status', {
        //     status: filters.status,
        //   });
        // }
        // if (filters.is_deleted !== undefined) {
        //   existing.andWhere('camera.is_deleted = :is_deleted', {
        //     is_deleted: filters.is_deleted,
        //   });
        // }
      }

      const total = await existing.getCount();
      const data = await existing
        .skip((page.offset - 1) * page.limit)
        .take(page.limit)
        .getMany();

      return {
        total,
        data,
      };
    } catch (error) {
      throw new HttpException(
        this.messageService.getMessage(
          'camera',
          language,
          'failed_to_fetch_camera_list',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, language?: LanguageDto) {
    try {
      const camera = await this.cameraRepository.findOne({
        where: { id },
        relations: ['building'],
      });

      if (!camera) {
        throw new HttpException(
          this.messageService.getMessage(
            'camera',
            language,
            'camera_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }

      return camera;
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        this.messageService.getMessage(
          'camera',
          language,
          'failed_to_fetch_camera_details',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateCameraDto: UpdateCameraDto,
    language?: LanguageDto,
  ) {
    try {
      const camera = await this.findOne(id, language);
      Object.assign(camera, updateCameraDto);
      return await this.cameraRepository.save(camera);
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        this.messageService.getMessage(
          'camera',
          language,
          'failed_to_update_camera',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, language?: LanguageDto) {
    try {
      const camera = await this.findOne(id, language);
      camera.is_deleted = true;
      camera.deleted_at = new Date();
      return await this.cameraRepository.save(camera);
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        this.messageService.getMessage(
          'camera',
          language,
          'failed_to_delete_camera',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
