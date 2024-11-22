import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class OffsetPaginationDto {
  @ApiProperty()
  @IsInt()
  @Transform(({ value }) => +value)
  offset: number;

  @ApiProperty()
  @IsInt()
  @Transform(({ value }) => +value)
  limit: number;
}
