import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { CreateEntranceDto } from './dto/create-entrance.dto';
import { UpdateEntranceDto } from './dto/update-entrance.dto';
import { FindEntranceDto } from './dto/find-entrance.dto';
import { LanguageDto } from '../../shared/types/enums';
import { Entrance } from './entities/entrance.entity';
import { ApartmentService } from '../apartment/apartment.service';

@Injectable()
export class EntranceService {
  constructor(
    @InjectRepository(Entrance)
    private entranceRepository: Repository<Entrance>,
    private readonly messageService: MessageService,
    private apartmentService: ApartmentService,
  ) {}

  async create(createEntranceDto: CreateEntranceDto, language?: LanguageDto) {
    try {
      // for (let i = 0; i < createEntranceDto.apartments_count; i++) {
      //   const apartment = this.apartmentService.create({
      //     apartments_count:
      //   })

      // }
      const newEntrance = this.entranceRepository.create(createEntranceDto);
      return await this.entranceRepository.save(newEntrance);
    } catch (error) {
      throw new HttpException(
        this.messageService.getMessage(
          'entrance',
          language,
          'failed_to_create_entrance',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(findEntranceDto: FindEntranceDto, language?: LanguageDto) {
    try {
      const {
        page = { offset: 1, limit: 10 },
        search,
        filters,
      } = findEntranceDto;
      const existing = this.entranceRepository.createQueryBuilder('entrance');

      if (search) {
        existing.where('entrance.number::text ILIKE :search', {
          search: `%${search}%`,
        });
      }

      if (filters) {
        existing.andWhere(filters);
        // if (filters.building_id) {
        //   existing.andWhere('entrance.building_id = :building_id', {
        //     building_id: filters.building_id,
        //   });
        // }
        // if (filters.intercom_id) {
        //   existing.andWhere('entrance.intercom_id = :intercom_id', {
        //     intercom_id: filters.intercom_id,
        //   });
        // }
        // if (filters.is_deleted !== undefined) {
        //   existing.andWhere('entrance.is_deleted = :is_deleted', {
        //     is_deleted: filters.is_deleted,
        //   });
        // }
      }

      const [items, count] = await existing
        .skip((page.offset - 1) * page.limit)
        .take(page.limit)
        .getManyAndCount();

      return { items, count };
    } catch (error) {
      throw new HttpException(
        this.messageService.getMessage(
          'entrance',
          language,
          'failed_to_fetch_entrance_list',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, language?: LanguageDto) {
    try {
      const entrance = await this.entranceRepository.findOne({
        where: { id },
        relations: ['building', 'intercom'],
      });

      if (!entrance) {
        throw new HttpException(
          this.messageService.getMessage(
            'entrance',
            language,
            'entrance_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }

      return entrance;
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        this.messageService.getMessage(
          'entrance',
          language,
          'failed_to_fetch_entrance_details',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateEntranceDto: UpdateEntranceDto,
    language?: LanguageDto,
  ) {
    try {
      const entrance = await this.findOne(id, language);
      Object.assign(entrance, updateEntranceDto);
      return await this.entranceRepository.save(entrance);
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        this.messageService.getMessage(
          'entrance',
          language,
          'failed_to_update_entrance',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, language?: LanguageDto) {
    try {
      const entrance = await this.findOne(id, language);
      entrance.is_deleted = true;
      entrance.deleted_at = new Date();
      return await this.entranceRepository.save(entrance);
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        this.messageService.getMessage(
          'entrance',
          language,
          'failed_to_delete_entrance',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
