import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CallLog } from './entities/call-log.entity';
import { Repository } from 'typeorm';
import { SortOrder } from '../../shared/types/enums';
import { CreateLogCallDto } from './dto/create-log-call.dto';
import { FindLogCallDto } from './dto/find-log-call.dto';

@Injectable()
export class LogCallService {
  constructor(
    @InjectRepository(CallLog)
    private logCallRepository: Repository<CallLog>,
  ) {}

  async create(createLogCallDto: CreateLogCallDto) {
    try {
      const newBuilding = this.logCallRepository.create(createLogCallDto);
      const result = await this.logCallRepository.save(newBuilding);

      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to create building',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll({
    page = { limit: 10, offset: 1 },
    search,
    filters = { is_deleted: false },
    sort = { by: 'created_at', order: SortOrder.DESC },
  }: FindLogCallDto): Promise<any> {
    try {
      const existing = this.logCallRepository
        .createQueryBuilder('callLog')
        .where('callLog.is_deleted = :is_deleted', {
          is_deleted: filters?.is_deleted ?? false,
        });

      if (search) {
        existing.where('callLog.phone ILIKE :search', {
          search: `%${search}%`,
        });
      }
      if (sort.by && sort.order) {
        existing.orderBy(`callLog.${sort.by}`, sort.order);
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
      console.log(error);

      throw new HttpException(
        'Failed to fetch call log',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existing = await this.logCallRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing) {
        throw new HttpException('Call log Not Found', HttpStatus.NOT_FOUND);
      }
      const callLog = this.logCallRepository.merge(existing, {
        is_deleted: true,
        deleted_at: new Date(),
      });
      await this.logCallRepository.save(callLog);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      } else if (error.code === '23503') {
        throw new HttpException(
          'Cannot delete call log due to related records in other tables',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to delete call log',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
