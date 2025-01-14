import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEnum,
  IsNumber,
  IsNotEmptyObject,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { CameraStatus } from '../../../shared/types/enums';
import { Type } from 'class-transformer';

class LocationDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}

export class CreateCameraDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  building_id: string;

  @ApiProperty()
  @IsOptional()
  entrance_ids: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  model?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ip_address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  stream_link?: string;

  @ApiProperty({ enum: CameraStatus })
  @IsOptional()
  @IsEnum(CameraStatus)
  status?: CameraStatus;
}
