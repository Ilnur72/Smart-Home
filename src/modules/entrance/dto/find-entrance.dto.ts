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
    description: 'Filter parameters',
    type: FilterEntranceDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterEntranceDto)
  filters?: FilterEntranceDto;
}
