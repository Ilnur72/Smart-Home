import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from './entities/region.entity';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { LanguageDto } from '../../shared/types/enums';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
    private readonly messageService: MessageService,
  ) {}

  async create(createRegionDto: CreateRegionDto, language: string) {
    try {
      const existing = await this.regionRepository.findOne({
        where: { name: createRegionDto.name },
      });
      if (existing)
        throw new HttpException(
          this.messageService.getMessage(
            'region',
            language,
            'already_exist_region',
          ),
          HttpStatus.BAD_REQUEST,
        );

      const newRegion = this.regionRepository.create(createRegionDto);
      return await this.regionRepository.save(newRegion);
    } catch (error) {
      if (error.status === 400) {
        throw new HttpException(
          this.messageService.getMessage(
            'region',
            language,
            'already_exist_region',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'region',
          language,
          'failed_to_create_region',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll({ filters }: any, language?: LanguageDto): Promise<any> {
    try {
      const existing = this.regionRepository
        .createQueryBuilder('region')
        .where('region.is_deleted = :is_deleted', {
          is_deleted: filters?.is_deleted ?? false,
        });

      if (filters) {
        existing.andWhere(filters);
      }
      existing.orderBy(
        `CASE WHEN "region"."name" = 'Toshkent shahar' THEN 1 ELSE 2 END`,
      );
      const total = await existing.getCount();
      const data = await existing.getMany();

      return { total, region: data };
    } catch (error) {
      throw new HttpException(
        this.messageService.getMessage(
          'region',
          language,
          'failed_to_fetch_region_list',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, language: LanguageDto): Promise<any> {
    try {
      const existing = await this.regionRepository.findOne({
        where: { id, is_deleted: false },
        relations: ['district'],
      });

      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'region',
            language,
            'region_not_found',
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
          'region',
          language,
          'failed_to_fetch_region_details',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateRegionDto: UpdateRegionDto,
    language: LanguageDto,
  ): Promise<Region> {
    try {
      const existing = await this.regionRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing)
        throw new HttpException(
          this.messageService.getMessage(
            'region',
            language,
            'region_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      const updatedRegion = this.regionRepository.merge(
        existing,
        updateRegionDto,
      );
      return await this.regionRepository.save(updatedRegion);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        this.messageService.getMessage(
          'region',
          language,
          'failed_to_update_region',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, language: LanguageDto): Promise<any> {
    try {
      const existing = await this.regionRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'region',
            language,
            'region_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }
      const region = this.regionRepository.merge(existing, {
        is_deleted: true,
      });
      await this.regionRepository.save(region);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      } else if (error.code === '23503') {
        throw new HttpException(
          this.messageService.getMessage(
            'region',
            language,
            'cannot_delete_region_due_to_related_records_in_other_tables',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'region',
          language,
          'failed_to_delete_region',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
