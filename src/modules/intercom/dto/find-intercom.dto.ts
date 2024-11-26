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
import { IntercomStatus } from '../../../shared/types/enums';

export class FilterIntercomDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(IntercomStatus)
  status?: IntercomStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  is_deleted?: boolean;
}

export class FindIntercomDto {
  @ApiProperty({
    description: 'Pagination parameters',
    type: OffsetPaginationDto,
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
    type: FilterIntercomDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterIntercomDto)
  filters?: FilterIntercomDto;
}
