import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSystemUserDto } from './dto/create-systemUser.dto';
import { UpdateSystemUserDto } from './dto/update-systemUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { LanguageDto, UserRole } from '../../shared/types/enums';
import { SystemUser } from './entities/systemUser.entity';
import { FindUserDto } from '../user/dto/find-user.dto';
import { hash } from 'bcryptjs';
// import { SortOrder } from '../../shared/types/enums';

@Injectable()
export class SystemUserService {
  constructor(
    @InjectRepository(SystemUser)
    private systemUserRepository: Repository<SystemUser>,
    private readonly messageService: MessageService,
  ) {}

  async create(createSystemUserDto: CreateSystemUserDto, language?: string) {
    try {
      const existing = await this.systemUserRepository.findOne({
        where: { login: createSystemUserDto.login },
      });
      if (existing)
        throw new HttpException(
          this.messageService.getMessage(
            'systemUser',
            language,
            'already_exist_systemUser',
          ),
          HttpStatus.BAD_REQUEST,
        );
      const hashedPassword: string = await hash(
        process.env.SYSTEM_ADMIN_PASSWORD,
        10,
      );
      createSystemUserDto.password = hashedPassword;
      const newSystemUser =
        this.systemUserRepository.create(createSystemUserDto);
      return await this.systemUserRepository.save(newSystemUser);
    } catch (error) {
      if (error.status === 400) {
        throw new HttpException(
          this.messageService.getMessage(
            'systemUser',
            language,
            'already_exist_systemUser',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'systemUser',
          language,
          'failed_to_create_systemUser',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    { page = { limit: 10, offset: 1 }, search, filters }: FindUserDto,
    language: LanguageDto,
  ): Promise<any> {
    try {
      const existing = this.systemUserRepository
        .createQueryBuilder('systemUser')
        .where('systemUser.is_deleted = :is_deleted', {
          is_deleted: filters?.is_deleted ?? false,
        });
      if (search) {
        existing.where(
          'systemUser.name ILIKE :search OR systemUser.login ILIKE :search',
          { search: `%${search}%` },
        );
      }
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
          'systemUser',
          language,
          'failed_to_fetch_systemUser_list',
        ),

        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, language: LanguageDto): Promise<any> {
    try {
      const existing = await this.systemUserRepository.findOne({
        where: { id, is_deleted: false },
      });

      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'systemUser',
            language,
            'systemUser_not_found',
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
          'systemUser',
          language,
          'failed_to_fetch_systemUser_details',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateSystemUserDto: UpdateSystemUserDto,
    language: LanguageDto,
  ): Promise<SystemUser> {
    try {
      const existing = await this.systemUserRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing)
        throw new HttpException(
          this.messageService.getMessage(
            'systemUser',
            language,
            'systemUser_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      const updatedSystemUser = this.systemUserRepository.merge(
        existing,
        updateSystemUserDto,
      );
      return await this.systemUserRepository.save(updatedSystemUser);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        this.messageService.getMessage(
          'systemUser',
          language,
          'failed_to_update_systemUser',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, language: LanguageDto): Promise<any> {
    try {
      const existing = await this.systemUserRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'systemUser',
            language,
            'systemUser_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }
      const systemUser = this.systemUserRepository.merge(existing, {
        is_deleted: true,
        deleted_at: new Date(),
      });
      await this.systemUserRepository.save(systemUser);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      } else if (error.code === '23503') {
        throw new HttpException(
          this.messageService.getMessage(
            'systemUser',
            language,
            'cannot_delete_systemUser_due_to_related_records_in_other_tables',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'systemUser',
          language,
          'failed_to_delete_systemUser',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
