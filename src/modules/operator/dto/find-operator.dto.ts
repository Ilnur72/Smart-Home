import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TransformBoolean } from '../../../shared/decorators/transform-boolean.decorator';
import { OffsetPaginationDto } from '../../../shared/dto/offset-pagination.dto';
import { SortOrder } from '../../../shared/types/enums';

export class SortCompanyDto {
  @ApiProperty({
    description: 'Sort by field: created_at or name',
    enum: ['created_at', 'name'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['created_at', 'name'])
  by?: string;

  @ApiProperty({
    description: 'Sort order: asc or desc',
    enum: SortOrder,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}

export class FitlerOperatorDto {
  @ApiProperty({
    description: 'Filter by deletion status',
    type: 'boolean',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  is_deleted?: boolean;
}

export class FindOperatorDto {
  @ApiProperty({ description: 'Search term', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Pagination parameters: limit and offset',
    title: 'Pagination',
    required: false,
  })
  @ValidateNested()
  @Type(() => OffsetPaginationDto)
  page?: OffsetPaginationDto;

  @ApiProperty({
    description: 'Sorting parameters',
    type: SortCompanyDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SortCompanyDto)
  sort?: SortCompanyDto;

  @ApiProperty({
    description: 'Filtering parameters',
    type: FitlerOperatorDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FitlerOperatorDto)
  filters?: FitlerOperatorDto;
}
