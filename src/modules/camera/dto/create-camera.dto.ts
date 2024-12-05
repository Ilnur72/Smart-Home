import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEnum,
  IsIP,
  IsNumber,
  IsNotEmptyObject,
  ValidateNested,
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
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsIP()
  ip_address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  stream_link: string;

  @ApiProperty({ enum: CameraStatus })
  @IsNotEmpty()
  @IsEnum(CameraStatus)
  status: CameraStatus;
}
