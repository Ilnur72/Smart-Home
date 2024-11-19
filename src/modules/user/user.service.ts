import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { LanguageStatus } from '../../shared/types/enums';
import { User } from './entities/user.entity';
// import { SortOrder } from 'src/shared/types/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly messageService: MessageService,
  ) {}

  async create(createUserDto: CreateUserDto, language?: string) {
    try {
      const existing = await this.userRepository.findOne({
        where: { phone: createUserDto.phone },
      });
      if (existing)
        throw new HttpException(
          this.messageService.getMessage(
            'user',
            language,
            'already_exist_user',
          ),
          HttpStatus.BAD_REQUEST,
        );

      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
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
    {
      page = { limit: 10, offset: 1 },
      search,
      filters = { isDeleted: false },
    }: // sort = { by: 'createdAt', order: SortOrder.DESC },

    any,
    language: LanguageStatus,
  ): Promise<any> {
    try {
      const existing = this.userRepository.createQueryBuilder('user');

      if (search) {
        existing.where(
          'user.name ILIKE :search OR user.surname ILIKE :search',
          { search: `%${search}%` },
        );
      }
      // if (sort.by && sort.order) {
      //   existing.orderBy(`user.${sort.by}`, sort.order);
      // }
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

  async findOne(id: string, language: LanguageStatus): Promise<any> {
    try {
      const existing = await this.userRepository.findOne({
        where: { id, isDeleted: false },
        relations: ['orders'],
      });

      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage('user', language, 'user_not_found'),
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
          'failed_to_fetch_user_deatils',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    language: LanguageStatus,
  ): Promise<User> {
    try {
      const existing = await this.userRepository.findOne({
        where: { id, isDeleted: false },
      });
      if (!existing)
        throw new HttpException(
          this.messageService.getMessage('user', language, 'user_not_found'),
          HttpStatus.NOT_FOUND,
        );
      const updatedUser = this.userRepository.merge(existing, updateUserDto);
      return await this.userRepository.save(updatedUser);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        this.messageService.getMessage(
          'user',
          language,
          'failed_to_update_user',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, language: LanguageStatus): Promise<any> {
    try {
      const existing = await this.userRepository.findOne({
        where: { id, isDeleted: false },
      });
      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage('user', language, 'user_not_found'),
          HttpStatus.NOT_FOUND,
        );
      }
      const user = this.userRepository.merge(existing, {
        isDeleted: true,
        deletedAt: new Date(),
      });
      await this.userRepository.save(user);
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
