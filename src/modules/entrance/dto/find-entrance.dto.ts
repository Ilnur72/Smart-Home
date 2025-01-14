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
import { SortOrder } from 'src/shared/types/enums';

export class SortEntranceDto {
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

export class FilterEntranceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  building_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  intercom_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  is_deleted?: boolean;
}

export class FindEntranceDto {
  @ApiProperty({
    description: 'Pagination parameters',
    type: OffsetPaginationDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => OffsetPaginationDto)
  page?: OffsetPaginationDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Sorting parameters',
    type: SortEntranceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SortEntranceDto)
  sort?: SortEntranceDto;

  @ApiProperty({
    description: 'Filter parameters',
    type: FilterEntranceDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterEntranceDto)
  filters?: FilterEntranceDto;
}
