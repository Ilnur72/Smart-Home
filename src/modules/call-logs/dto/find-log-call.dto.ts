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

// ?q=first_name&page[offset]=0&page[limit]=10&sort[by]=first_name&sort[order]=asc
export class SortLogCallDto {
  @ApiProperty({
    description: 'Sort by field: created_at',
    enum: ['created_at'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['created_at'])
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

export class FilterLogCallDto {
  @ApiProperty({
    description: 'Filter by deletion status',
    type: 'boolean',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  is_deleted?: boolean;

  @ApiProperty({
    description: 'Filter by status',
    type: 'string',
    required: false,
  })
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Filter by dest',
    type: 'string',
    required: false,
  })
  @IsOptional()
  dest?: string;

  @ApiProperty({
    description: 'Filter by caller',
    type: 'string',
    required: false,
  })
  @IsOptional()
  caller?: string;
}

export class FindLogCallDto {
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
    type: SortLogCallDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SortLogCallDto)
  sort?: SortLogCallDto;

  @ApiProperty({
    description: 'Filtering parameters',
    type: FilterLogCallDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterLogCallDto)
  filters?: FilterLogCallDto;
}
