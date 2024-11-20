import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { LanguageStatus } from '../../shared/types/enums';
import { Operator } from './entities/operator.entity';
// import { SortOrder } from '../../shared/types/enums';

@Injectable()
export class OperatorService {
  constructor(
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    private readonly messageService: MessageService,
  ) {}

  async create(createOperatorDto: CreateOperatorDto, language?: string) {
    try {
      const existing = await this.operatorRepository.findOne({
        where: { login: createOperatorDto.login },
      });
      if (existing)
        throw new HttpException(
          this.messageService.getMessage(
            'operator',
            language,
            'already_exist_operator',
          ),
          HttpStatus.BAD_REQUEST,
        );

      const newOperator = this.operatorRepository.create(createOperatorDto);
      return await this.operatorRepository.save(newOperator);
    } catch (error) {
      if (error.status === 400) {
        throw new HttpException(
          this.messageService.getMessage(
            'operator',
            language,
            'already_exist_operator',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'operator',
          language,
          'failed_to_create_operator',
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
      const existing = this.operatorRepository.createQueryBuilder('operator');

      if (search) {
        existing.where(
          'operator.name ILIKE :search OR operator.surname ILIKE :search',
          { search: `%${search}%` },
        );
      }
      // if (sort.by && sort.order) {
      //   existing.orderBy(`operator.${sort.by}`, sort.order);
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
          'operator',
          language,
          'failed_to_fetch_operator_list',
        ),

        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, language: LanguageStatus): Promise<any> {
    try {
      const existing = await this.operatorRepository.findOne({
        where: { id, is_deleted: false },
        relations: ['orders'],
      });

      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'operator',
            language,
            'operator_not_found',
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
          'operator',
          language,
          'failed_to_fetch_operator_deatils',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateOperatorDto: UpdateOperatorDto,
    language: LanguageStatus,
  ): Promise<Operator> {
    try {
      const existing = await this.operatorRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing)
        throw new HttpException(
          this.messageService.getMessage(
            'operator',
            language,
            'operator_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      const updatedOperator = this.operatorRepository.merge(
        existing,
        updateOperatorDto,
      );
      return await this.operatorRepository.save(updatedOperator);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        this.messageService.getMessage(
          'operator',
          language,
          'failed_to_update_operator',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, language: LanguageStatus): Promise<any> {
    try {
      const existing = await this.operatorRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'operator',
            language,
            'operator_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }
      const operator = this.operatorRepository.merge(existing, {
        is_deleted: true,
        deleted_at: new Date(),
      });
      await this.operatorRepository.save(operator);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      } else if (error.code === '23503') {
        throw new HttpException(
          this.messageService.getMessage(
            'operator',
            language,
            'cannot_delete_operator_due_to_related_records_in_other_tables',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'operator',
          language,
          'failed_to_delete_operator',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}