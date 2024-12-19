import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBuildingDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  district_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  floor: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  entrance_count: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  apartments_count: number;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  operator_id?: string;
}
