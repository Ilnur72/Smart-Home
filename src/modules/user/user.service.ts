import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { LanguageDto, SortOrder, UserRole } from '../../shared/types/enums';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';
// import { hash } from 'bcryptjs';
// import { SortOrder } from '../../shared/types/enums';

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
        where: { phone: createUserDto.phone, is_deleted: false },
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
      // const hashedPassword: string = await hash(createUserDto.password, 10);
      // createUserDto.password = hashedPassword;
      const newUser = this.userRepository.create({
        ...createUserDto,
        role: UserRole.USER,
      });
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
      filters = { is_deleted: false },
      sort = { by: 'created_at', order: SortOrder.DESC },
    }: FindUserDto,

    language: LanguageDto,
  ): Promise<any> {
    try {
      const existing = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userApartments', 'userApartment')
        .leftJoinAndSelect('userApartment.apartment', 'apartment')
        .leftJoinAndSelect('apartment.entrance', 'entrance')
        .leftJoinAndSelect('entrance.buildings', 'building')
        .where('user.is_deleted = :is_deleted', {
          is_deleted: filters?.is_deleted ?? false,
        });

      if (search) {
        existing.where(
          'user.fullname ILIKE :search OR user.phone ILIKE :search',
          {
            search: `%${search}%`,
          },
        );
      }
      if (sort.by && sort.order) {
        existing.orderBy(`user.${sort.by}`, sort.order);
      }
      if (filters) {
        existing.andWhere(filters);
      }
      const total = await existing.getCount();
      const data = await existing
        .skip((page.offset - 1) * page.limit)
        .take(page.limit)
        // .select([
        //   'user',
        //   'userApartment.apartment.number', // Select apartment number
        //   // 'building.name AS buildingName', // Select building name
        // ])
        .getMany();

      return { total, data, limit: page.limit, offset: page.offset };
    } catch (error) {
      console.log(error);

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
      const existing = await this.userRepository.findOne({
        where: { id, is_deleted: false },
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
          'failed_to_fetch_user_details',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneByPhone(phone?: string): Promise<any> {
    try {
      const existing = await this.userRepository.findOne({
        where: { phone, is_deleted: false },
      });
      if (!existing) throw new NotFoundException(`User not found`);

      return existing;
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user details');
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    language: LanguageDto,
  ): Promise<User> {
    try {
      const existing = await this.userRepository.findOne({
        where: { id, is_deleted: false },
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

  async remove(id: string, language: LanguageDto): Promise<any> {
    try {
      const existing = await this.userRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage('user', language, 'user_not_found'),
          HttpStatus.NOT_FOUND,
        );
      }
      const user = this.userRepository.merge(existing, {
        is_deleted: true,
        deleted_at: new Date(),
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
