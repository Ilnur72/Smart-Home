import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { Apartment } from './entities/apartment.entity';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { FindApartmentDto } from './dto/find-apartment.dto';
import { LanguageDto } from '../../shared/types/enums';

@Injectable()
export class ApartmentService {
  constructor(
    @InjectRepository(Apartment)
    private apartmentRepository: Repository<Apartment>,
    private readonly messageService: MessageService,
  ) {}

  async create(createApartmentDto: CreateApartmentDto, language?: LanguageDto) {
    try {
      const newApartment = this.apartmentRepository.create(createApartmentDto);
      return await this.apartmentRepository.save(newApartment);
    } catch (error) {
      throw new HttpException(
        this.messageService.getMessage(
          'apartment',
          language,
          'failed_to_create_apartment',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(findApartmentDto: FindApartmentDto, language?: LanguageDto) {
    try {
      const {
        page = { offset: 1, limit: 10 },
        search,
        filters,
      } = findApartmentDto;
      const existing = this.apartmentRepository
        .createQueryBuilder('apartment')
        .where('apartment.is_deleted = :is_deleted', {
          is_deleted: filters?.is_deleted ?? false,
        });

      if (search) {
        existing.where('apartment.number ILIKE :search', {
          search: `%${search}%`,
        });
      }

      if (filters) {
        existing.andWhere(filters);
        // if (filters.entrance_id) {
        //   existing.andWhere('apartment.entrance_id = :entrance_id', {
        //     entrance_id: filters.entrance_id,
        //   });
        // }
        // if (filters.intercom_id) {
        //   existing.andWhere('apartment.intercom_id = :intercom_id', {
        //     intercom_id: filters.intercom_id,
        //   });
        // }
        // if (filters.is_deleted !== undefined) {
        //   existing.andWhere('apartment.is_deleted = :is_deleted', {
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
      console.log(error);
      throw new HttpException(
        this.messageService.getMessage(
          'apartment',
          language,
          'failed_to_fetch_apartment_list',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, language?: LanguageDto) {
    try {
      const apartment = await this.apartmentRepository.findOne({
        where: { id },
        relations: ['entrance', 'intercom'],
      });

      if (!apartment) {
        throw new HttpException(
          this.messageService.getMessage(
            'apartment',
            language,
            'apartment_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }

      return apartment;
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        this.messageService.getMessage(
          'apartment',
          language,
          'failed_to_fetch_apartment_list',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateApartmentDto: UpdateApartmentDto,
    language?: LanguageDto,
  ) {
    try {
      const apartment = await this.findOne(id, language);
      Object.assign(apartment, updateApartmentDto);
      return await this.apartmentRepository.save(apartment);
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        this.messageService.getMessage(
          'apartment',
          language,
          'failed_to_update_apartment',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, language?: LanguageDto) {
    try {
      const apartment = await this.findOne(id, language);
      apartment.is_deleted = true;
      apartment.deleted_at = new Date();
      return await this.apartmentRepository.save(apartment);
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        this.messageService.getMessage(
          'apartment',
          language,
          'failed_to_delete_apartment',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
