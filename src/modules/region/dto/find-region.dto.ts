import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindRegionDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  region_id?: string;
}
