import { OffsetPaginationDto } from '../../../shared/dto/offset-pagination.dto';
import { SortOrder } from '../../../shared/types/enums';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransformBoolean } from '../../../shared/decorators/transform-boolean.decorator';

// ?search=first_name&page[offset]=0&page[limit]=10&sort[by]=first_name&sort[order]=asc
export class SortBuildingDto {
  @ApiProperty({
    description: 'Sort by field: created_at or floor',
    enum: ['created_at', 'floor'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['created_at', 'floor'])
  by?: string;

  @ApiProperty({
    required: false,
    description: 'Sort order: asc or desc',
    enum: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}

export class FilterBuildingDto {
  @ApiProperty({
    required: false,
    description: 'Filter by deletion status',
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  is_deleted?: boolean;

  @ApiProperty({
    required: false,
    description: 'Filter by region',
    type: 'string',
  })
  @IsOptional()
  region_id?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by district',
    type: 'string',
  })
  @IsOptional()
  district_id?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by number of floor',
    type: 'number',
  })
  @IsOptional()
  floor?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by operator',
    type: 'string',
  })
  @IsOptional()
  operator_id?: string;
}

export class FindBuildingDto {
  @ApiProperty({ required: false, description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Pagination parameters: limit and offset',
    title: 'Pagination',
  })
  @ValidateNested()
  @Type(() => OffsetPaginationDto)
  page?: OffsetPaginationDto;

  @ApiProperty({
    required: false,
    description: 'Sorting parameters',
    type: SortBuildingDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SortBuildingDto)
  sort?: SortBuildingDto;

  @ApiProperty({
    required: false,
    description: 'Filtering parameters',
    type: FilterBuildingDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterBuildingDto)
  filters?: FilterBuildingDto;
}
