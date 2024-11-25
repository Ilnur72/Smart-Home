import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateEntranceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  building_id: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  intercom_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  apartment_number: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  number: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  camera_ids?: string[];
}
