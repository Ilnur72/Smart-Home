import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { TransformBoolean } from '../../../shared/decorators/transform-boolean.decorator';
import { OffsetPaginationDto } from '../../../shared/dto/offset-pagination.dto';
import { CameraStatus } from '../../../shared/types/enums';

export class FilterCameraDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  building_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(CameraStatus)
  status?: CameraStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  is_deleted?: boolean;
}

export class FindCameraDto {
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
    type: FilterCameraDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterCameraDto)
  filters?: FilterCameraDto;
}
