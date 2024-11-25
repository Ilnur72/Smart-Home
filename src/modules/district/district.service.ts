import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from './entities/district.entity';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { LanguageDto } from '../../shared/types/enums';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    private readonly messageService: MessageService,
  ) {}

  async create(createDistrictDto: CreateDistrictDto, language: string) {
    try {
      const existing = await this.districtRepository.findOne({
        where: { name: createDistrictDto.name },
      });
      if (existing)
        throw new HttpException(
          this.messageService.getMessage(
            'district',
            language,
            'already_exist_district',
          ),
          HttpStatus.BAD_REQUEST,
        );

      const newDistrict = this.districtRepository.create(createDistrictDto);
      return await this.districtRepository.save(newDistrict);
    } catch (error) {
      if (error.status === 400) {
        throw new HttpException(
          this.messageService.getMessage(
            'district',
            language,
            'already_exist_district',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log(error);
      throw new HttpException(
        this.messageService.getMessage(
          'district',
          language,
          'failed_to_create_district',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll({ search, filters }: any, language: LanguageDto): Promise<any> {
    try {
      const existing = this.districtRepository
        .createQueryBuilder('district')
        .where('district.is_deleted = :is_deleted', { is_deleted: false });
      if (search) {
        existing.where('district.name ILIKE :search', {
          search: `%${search}%`,
        });
      }

      if (filters) {
        existing.andWhere(filters);
      }
      const total = await existing.getCount();
      const data = await existing.getMany();

      return { total, data };
    } catch (error) {
      throw new HttpException(
        this.messageService.getMessage(
          'district',
          language,
          'failed_to_fetch_district_list',
        ),

        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, language: LanguageDto): Promise<any> {
    try {
      const existing = await this.districtRepository.findOne({
        where: { id, is_deleted: false },
      });
      console.log(existing);

      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'district',
            language,
            'district_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }
      return existing;
    } catch (error) {
      console.log(error);
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        this.messageService.getMessage(
          'district',
          language,
          'failed_to_fetch_district_details',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateDistrictDto: UpdateDistrictDto,
    language: LanguageDto,
  ): Promise<District> {
    try {
      const existing = await this.districtRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing)
        throw new HttpException(
          this.messageService.getMessage(
            'district',
            language,
            'district_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      const updatedDistrict = this.districtRepository.merge(
        existing,
        updateDistrictDto,
      );
      return await this.districtRepository.save(updatedDistrict);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        this.messageService.getMessage(
          'district',
          language,
          'failed_to_update_district',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, language: LanguageDto): Promise<any> {
    try {
      const existing = await this.districtRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'district',
            language,
            'district_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }
      const district = this.districtRepository.merge(existing, {
        is_deleted: true,
      });
      await this.districtRepository.save(district);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      } else if (error.code === '23503') {
        throw new HttpException(
          this.messageService.getMessage(
            'district',
            language,
            'cannot_delete_district_due_to_related_records_in_other_tables',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'district',
          language,
          'failed_to_delete_district',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
