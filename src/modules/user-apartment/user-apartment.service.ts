import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserApartmentDto } from './dto/create-user-apartment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { LanguageDto } from '../../shared/types/enums';
import { UserApartment } from './entities/user-apartment.entity';

@Injectable()
export class UserApartmentService {
  constructor(
    @InjectRepository(UserApartment)
    private userApartmentRepository: Repository<UserApartment>,
    private readonly messageService: MessageService,
  ) {}

  async create(
    createUserApartmentDto: CreateUserApartmentDto,
    language?: string,
  ) {
    try {
      const newUserApartment = this.userApartmentRepository.create(
        createUserApartmentDto,
      );
      return await this.userApartmentRepository.save(newUserApartment);
    } catch (error) {
      if (error.status === 400) {
        throw new HttpException(
          this.messageService.getMessage(
            'user',
            language,
            'already_exist_user',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'user',
          language,
          'failed_to_create_user',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    { page = { limit: 10, offset: 1 }, filters = { is_deleted: false } }: any,

    language: LanguageDto,
  ): Promise<any> {
    try {
      const existing = this.userApartmentRepository
        .createQueryBuilder('userApartment')
        .leftJoinAndSelect('userApartment.user', 'user') // User bilan bog'lanish
        .leftJoinAndSelect('userApartment.apartment', 'apartment') // Apartment bilan bog'lanish
        .leftJoinAndSelect('apartment.entrance', 'entrance') // Entrance bilan bog'lanish
        .leftJoinAndSelect('entrance.buildings', 'building')
        .where('userApartment.is_deleted = :is_deleted', {
          is_deleted: filters?.is_deleted ?? false,
        });
      if (filters) {
        existing.andWhere(filters);
      }
      const total = await existing.getCount();
      const data = await existing
        .skip((page.offset - 1) * page.limit)
        .take(page.limit)
        .getMany();

      return { total, data, limit: page.limit, offset: page.offset };
    } catch (error) {
      throw new HttpException(
        this.messageService.getMessage(
          'user',
          language,
          'failed_to_fetch_user_list',
        ),

        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, language: LanguageDto): Promise<any> {
    try {
      const existing = await this.userApartmentRepository.findOne({
        where: { id, is_deleted: false },
      });

      if (!existing) {
        throw new HttpException(
          'Not found user-apartment',
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
          'user',
          language,
          'failed_to_fetch_user_details',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, language: LanguageDto): Promise<any> {
    try {
      const existing = await this.userApartmentRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing) {
        throw new HttpException(
          'Not found user-apartment',
          HttpStatus.NOT_FOUND,
        );
      }
      // const user = this.userApartmentRepository.merge(existing, {
      //   is_deleted: true,
      //   deleted_at: new Date(),
      // });
      await this.userApartmentRepository.delete(id);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      } else if (error.code === '23503') {
        throw new HttpException(
          this.messageService.getMessage(
            'user',
            language,
            'cannot_delete_user_due_to_related_records_in_other_tables',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'user',
          language,
          'failed_to_delete_user',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
