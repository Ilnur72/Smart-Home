import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { Intercom } from './entities/intercom.entity';
import { CreateIntercomDto } from './dto/create-intercom.dto';
import { UpdateIntercomDto } from './dto/update-intercom.dto';
import { FindIntercomDto } from './dto/find-intercom.dto';
import { LanguageDto } from '../../shared/types/enums';
import httpClient from 'urllib';

@Injectable()
export class IntercomService {
  constructor(
    @InjectRepository(Intercom)
    private intercomRepository: Repository<Intercom>,
    private readonly messageService: MessageService,
  ) {}

  async controlDoor(intercomId?: string, language?: LanguageDto) {
    try {
      const intercom = await this.intercomRepository.findOne({
        where: { id: intercomId },
      });
      if (!intercom) throw new NotFoundException('Intercom not found');

      const data = `<RemoteControlDoor version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
    <doorNo min="1" max="1"></doorNo>
    <cmd>open</cmd>
  </RemoteControlDoor>`;
      const url = `https://${intercom.device_ip}/ISAPI/AccessControl/RemoteControl/door/1`;
      const options = {
        method: 'PUT',
        rejectUnauthorized: false,
        digestAuth: `${intercom.device_login}:${intercom.device_password}`,
        content: data,
        headers: {
          'Content-Type': 'application/xml',
        },
      };
      await httpClient.request(url, options);
      return 'opened';
    } catch (error) {
      throw new HttpException(
        this.messageService.getMessage(
          'intercom',
          language,
          'failed_to_open_door',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createIntercomDto: CreateIntercomDto, language?: LanguageDto) {
    try {
      const existing = await this.intercomRepository.findOne({
        where: { entrance_id: createIntercomDto.entrance_id },
      });
      console.log(existing);

      if (existing)
        throw new BadRequestException(
          'Bir podyezd uchun faqat bitta domofon yarata olasiz',
        );
      const newIntercom = this.intercomRepository.create(createIntercomDto);
      return await this.intercomRepository.save(newIntercom);
    } catch (error) {
      console.log(error);
      if (error.response.statusCode === 400)
        throw new HttpException(error.response.message, HttpStatus.BAD_REQUEST);
      throw new HttpException(
        this.messageService.getMessage(
          'intercom',
          language,
          'failed_to_create_intercom',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(findIntercomDto: FindIntercomDto, language?: LanguageDto) {
    try {
      const {
        page = { offset: 1, limit: 10 },
        search,
        filters,
      } = findIntercomDto;
      const queryBuilder =
        this.intercomRepository.createQueryBuilder('intercom');

      if (search) {
        queryBuilder.where('intercom.model ILIKE :search', {
          search: `%${search}%`,
        });
      }

      if (filters) {
        if (filters.status) {
          queryBuilder.andWhere('intercom.status = :status', {
            status: filters.status,
          });
        }
        if (filters.is_deleted !== undefined) {
          queryBuilder.andWhere('intercom.is_deleted = :is_deleted', {
            is_deleted: filters.is_deleted,
          });
        }
      }

      const [items, count] = await queryBuilder
        .skip((page.offset - 1) * page.limit)
        .take(page.limit)
        .getManyAndCount();

      return { items, count };
    } catch (error) {
      throw new HttpException(
        this.messageService.getMessage(
          'intercom',
          language,
          'failed_to_fetch_intercom_list',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, language?: LanguageDto) {
    try {
      const intercom = await this.intercomRepository.findOne({
        where: { id },
      });

      if (!intercom) {
        throw new HttpException(
          this.messageService.getMessage(
            'intercom',
            language,
            'intercom_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }

      return intercom;
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        this.messageService.getMessage(
          'intercom',
          language,
          'failed_to_fetch_intercom_details',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateIntercomDto: UpdateIntercomDto,
    language?: LanguageDto,
  ) {
    try {
      const intercom = await this.findOne(id, language);
      Object.assign(intercom, updateIntercomDto);
      return await this.intercomRepository.save(intercom);
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        this.messageService.getMessage(
          'intercom',
          language,
          'failed_to_update_intercom',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, language?: LanguageDto) {
    try {
      const intercom = await this.findOne(id, language);
      intercom.is_deleted = true;
      intercom.deleted_at = new Date();
      return await this.intercomRepository.save(intercom);
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        this.messageService.getMessage(
          'intercom',
          language,
          'failed_to_delete_intercom',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
