import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { Repository } from 'typeorm';
import { MessageService } from '../../i18n/message.service';
import { LanguageDto } from '../../shared/types/enums';
import { FindBuildingDto } from './dto/find-building.dto';

@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    private readonly messageService: MessageService,
  ) {}

  async create(createBuildingDto: CreateBuildingDto, language: LanguageDto) {
    try {
      const newBuilding = this.buildingRepository.create(createBuildingDto);
      const result = await this.buildingRepository.save(newBuilding);

      return result;
    } catch (error) {
      if (error.status === 400) {
        throw new HttpException(
          this.messageService.getMessage(
            'building',
            language,
            'already_exist_building',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'building',
          language,
          'failed_to_create_building',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    { search, filters, page = { offset: 1, limit: 10 }, sort }: FindBuildingDto,
    language?: LanguageDto,
  ): Promise<any> {
    try {
      const existing = this.buildingRepository
        .createQueryBuilder('building')
        .leftJoinAndSelect('building.district', 'district')
        .leftJoinAndSelect('district.region', 'region')
        .leftJoinAndSelect('building.operator', 'operator')
        .where('building.is_deleted = :is_deleted', {
          is_deleted: filters?.is_deleted ?? false,
        });

      if (search) {
        existing.where('building.address ILIKE :search', {
          search: `%${search}%`,
        });
      }
      if (filters) {
        if (filters.region_id)
          existing.andWhere('region.id = :region_id', {
            region_id: filters.region_id,
          });
        else existing.andWhere(filters);
      }

      if (sort?.by && sort?.order) {
        existing.orderBy(`building.${sort.by}`, sort.order);
      }

      const total = await existing.getCount();
      const data = await existing
        .skip((page.offset - 1) * page.limit)
        .take(page.limit)
        .getMany();
      return {
        total,
        buildings: data.map((building) => {
          const { address, district, operator, ...filteredBuilding } = building;
          return {
            ...filteredBuilding,
            address: {
              street: address,
              district: district.name,
              region: district.region.name,
            },
            operator_name: operator ? operator.name : null,
          };
        }),
      };
    } catch (error) {
      throw new HttpException(
        this.messageService.getMessage(
          'building',
          language,
          'failed_to_fetch_building_list',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, language: LanguageDto): Promise<any> {
    try {
      const existing = await this.buildingRepository.findOne({
        where: { id, is_deleted: false },
        relations: ['district', 'district.region', 'entrances'],
      });

      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'building',
            language,
            'building_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }
      const { address, district, ...filteredBuilding } = existing;

      const fullAddress = {
        street: address,
        district: district.name,
        region: district.region.name,
      };
      console.log({
        ...filteredBuilding,
        address: fullAddress,
      });

      return {
        ...filteredBuilding,
        address: fullAddress,
      };
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        this.messageService.getMessage(
          'building',
          language,
          'failed_to_fetch_building_details',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateBuildingDto: UpdateBuildingDto,
    language: LanguageDto,
  ): Promise<Building> {
    try {
      const existing = await this.buildingRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing)
        throw new HttpException(
          this.messageService.getMessage(
            'building',
            language,
            'building_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      const updatedBuilding = this.buildingRepository.merge(
        existing,
        updateBuildingDto,
      );
      return await this.buildingRepository.save(updatedBuilding);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        this.messageService.getMessage(
          'building',
          language,
          'failed_to_update_building',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, language: LanguageDto): Promise<any> {
    try {
      const existing = await this.buildingRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing) {
        throw new HttpException(
          this.messageService.getMessage(
            'building',
            language,
            'building_not_found',
          ),
          HttpStatus.NOT_FOUND,
        );
      }
      const building = this.buildingRepository.merge(existing, {
        is_deleted: true,
        deleted_at: new Date(),
      });
      await this.buildingRepository.save(building);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      } else if (error.code === '23503') {
        throw new HttpException(
          this.messageService.getMessage(
            'building',
            language,
            'cannot_delete_building_due_to_related_records_in_other_tables',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        this.messageService.getMessage(
          'building',
          language,
          'failed_to_delete_building',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
