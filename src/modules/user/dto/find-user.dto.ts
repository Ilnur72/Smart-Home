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
export class SortUserDto {
  @ApiProperty({
    description: 'Sort by field: created_at or fullname',
    enum: ['created_at', 'fullname'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['created_at', 'fullname'])
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

export class FilterUserDto {
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
    description: 'Filter by role',
    type: 'string',
    required: false,
  })
  @IsOptional()
  role?: string;
}

export class FindUserDto {
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
    type: SortUserDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SortUserDto)
  sort?: SortUserDto;

  @ApiProperty({
    description: 'Filtering parameters',
    type: FilterUserDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterUserDto)
  filters?: FilterUserDto;
}
