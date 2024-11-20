import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { LanguageStatus } from '../../shared/types/enums';
import { OperatorUser } from './entities/operatorUser.entity';
import { CreateOperatorUserDto } from './dto/create-operatorUser.dto';
import { UpdateOperatorUserDto } from './dto/update-operatorUser.dto';
// import { SortOrder } from '../../shared/types/enums';

@Injectable()
export class OperatorUserService {
  constructor(
    @InjectRepository(OperatorUser)
    private operatorUserRepository: Repository<OperatorUser>,
    private readonly messageService: MessageService,
  ) {}

  async create(
    createOperatorUserDto: CreateOperatorUserDto,
    language?: string,
  ) {
    try {
      const existing = await this.operatorUserRepository.findOne({
        where: { login: createOperatorUserDto.login },
      });
      if (existing)
        throw new HttpException(
          this.messageService.getMessage(
            'operatorUser',
            language,
            'already_exist_operatorUser',
          ),
          HttpStatus.BAD_REQUEST,
        );

      const newOperatorUser = this.operatorUserRepository.create(
        createOperatorUserDto,
      );
      return await this.operatorUserRepository.save(newOperatorUser);
    } catch (error) {
      if (error.status === 400) {
        throw new HttpException(
          this.messageService.getMessage(
            'operatorUser',
            language,
            'already_exist_operatorUser',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'operatorUser',
          language,
          'failed_to_create_operatorUser',
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
    }: // sort = { by: 'created_at', order: SortOrder.DESC },

    any,
    language: LanguageStatus,
  ): Promise<any> {
    try {
      const existing =
        this.operatorUserRepository.createQueryBuilder('operatorUser');

      if (search) {
        existing.where(
          'operatorUser.name ILIKE :search OR operatorUser.surname ILIKE :search',
          { search: `%${search}%` },
        );
      }
      // if (sort.by && sort.order) {
      //   existing.orderBy(`operatorUser.${sort.by}`, sort.order);
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
          'operatorUser',
          language,
          'failed_to_fetch_operatorUser_list',
        ),

        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, language: LanguageStatus): Promise<any> {
    try {
      const existing = await this.operatorUserRepository.findOne({
        where: { id, is_deleted: false },
        relations: ['orders'],
      });

      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'operatorUser',
            language,
            'operatorUser_not_found',
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
          'operatorUser',
          language,
          'failed_to_fetch_operatorUser_deatils',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateOperatorUserDto: UpdateOperatorUserDto,
    language: LanguageStatus,
  ): Promise<OperatorUser> {
    try {
      const existing = await this.operatorUserRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing)
        throw new HttpException(
          this.messageService.getMessage(
            'operatorUser',
            language,
            'operatorUser_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      const updatedOperatorUser = this.operatorUserRepository.merge(
        existing,
        updateOperatorUserDto,
      );
      return await this.operatorUserRepository.save(updatedOperatorUser);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        this.messageService.getMessage(
          'operatorUser',
          language,
          'failed_to_update_operatorUser',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, language: LanguageStatus): Promise<any> {
    try {
      const existing = await this.operatorUserRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'operatorUser',
            language,
            'operatorUser_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }
      const operatorUser = this.operatorUserRepository.merge(existing, {
        is_deleted: true,
        deleted_at: new Date(),
      });
      await this.operatorUserRepository.save(operatorUser);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      } else if (error.code === '23503') {
        throw new HttpException(
          this.messageService.getMessage(
            'operatorUser',
            language,
            'cannot_delete_operatorUser_due_to_related_records_in_other_tables',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'operatorUser',
          language,
          'failed_to_delete_operatorUser',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
