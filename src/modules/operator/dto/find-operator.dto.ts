import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TransformBoolean } from '../../../shared/decorators/transform-boolean.decorator';
import { OffsetPaginationDto } from '../../../shared/dto/offset-pagination.dto';

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
    description: 'Filtering parameters',
    type: FitlerOperatorDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FitlerOperatorDto)
  filters?: FitlerOperatorDto;
}
