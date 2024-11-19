import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { LanguageStatus } from '../../shared/types/enums';

@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    private readonly messageService: MessageService,
  ) {}

  async create(createBuildingDto: CreateBuildingDto, language: string) {
    try {
      // const existing = await this.buildingRepository.findOne({
      //   where: { name: createBuildingDto.name },
      // });
      // if (existing)
      //   throw new HttpException(
      //     this.messageService.getMessage(
      //       'building',
      //       language,
      //       'already_exist_building',
      //     ),
      //     HttpStatus.BAD_REQUEST,
      //   );

      const newBuilding = this.buildingRepository.create(createBuildingDto);
      return await this.buildingRepository.save(newBuilding);
    } catch (error) {
      if (error.status === 400) {
        throw new HttpException(
          this.messageService.getMessage(
            'building',
            language,
            'already_exist_building',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'building',
          language,
          'failed_to_create_building',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    { search, filters = { isDeleted: false } }: any,
    language?: LanguageStatus,
  ): Promise<any> {
    try {
      const existing = this.buildingRepository.createQueryBuilder('building');

      if (search) {
        existing.where('building.name ILIKE :search ILIKE :search', {
          search: `%${search}%`,
        });
      }
      if (filters) {
        existing.andWhere(filters);
      }
      existing.orderBy(
        `CASE WHEN "building"."name" = 'Qoraqalpog''iston Resp.' THEN 1 ELSE 2 END`,
      );
      const total = await existing.getCount();
      const data = await existing.getMany();

      return { total, data };
    } catch (error) {
      throw new HttpException(
        this.messageService.getMessage(
          'building',
          language,
          'failed_to_fetch_building_list',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, language: LanguageStatus): Promise<any> {
    try {
      const existing = await this.buildingRepository.findOne({
        where: { id, is_deleted: false },
        relations: ['district'],
      });

      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'building',
            language,
            'building_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }
      return existing;
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        this.messageService.getMessage(
          'building',
          language,
          'failed_to_fetch_building_deatils',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateBuildingDto: UpdateBuildingDto,
    language: LanguageStatus,
  ): Promise<Building> {
    try {
      const existing = await this.buildingRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing)
        throw new HttpException(
          this.messageService.getMessage(
            'building',
            language,
            'building_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      const updatedBuilding = this.buildingRepository.merge(
        existing,
        updateBuildingDto,
      );
      return await this.buildingRepository.save(updatedBuilding);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        this.messageService.getMessage(
          'building',
          language,
          'failed_to_update_building',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, language: LanguageStatus): Promise<any> {
    try {
      const existing = await this.buildingRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'building',
            language,
            'building_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }
      const building = this.buildingRepository.merge(existing, {
        is_deleted: true,
        deleted_at: new Date(),
      });
      await this.buildingRepository.save(building);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      } else if (error.code === '23503') {
        throw new HttpException(
          this.messageService.getMessage(
            'building',
            language,
            'cannot_delete_building_due_to_related_records_in_other_tables',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'building',
          language,
          'failed_to_delete_building',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
