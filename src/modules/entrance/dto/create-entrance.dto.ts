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
  @IsString()
  @IsNotEmpty()
  building_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  intercom_ip: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  intercom_login: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  intercom_password: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  intercom_id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  apartments_count: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  first_apartment_number?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  last_apartment_number?: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  camera_ids?: string[];
}
