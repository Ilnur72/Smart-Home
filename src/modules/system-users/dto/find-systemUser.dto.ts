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

export class FitlerSystemUserDto {
  @ApiProperty({ description: 'Filter by deletion status', type: 'boolean' })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  is_deleted?: boolean;
}

export class FindSystemUserDto {
  @ApiProperty({ description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Pagination parameters: limit and offset',
    title: 'Pagination',
  })
  @ValidateNested()
  @Type(() => OffsetPaginationDto)
  page?: OffsetPaginationDto;

  @ApiProperty({
    description: 'Filtering parameters',
    type: FitlerSystemUserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FitlerSystemUserDto)
  filters?: FitlerSystemUserDto;
}
