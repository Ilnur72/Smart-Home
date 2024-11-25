import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsObject,
  IsEnum,
  IsIP,
} from 'class-validator';
import { CameraStatus } from '../../../shared/types/enums';

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
  @IsObject()
  location: Record<string, any>;

  @ApiProperty()
  @IsNotEmpty()
  @IsIP()
  ip_address: string;

  @ApiProperty({ enum: CameraStatus })
  @IsNotEmpty()
  @IsEnum(CameraStatus)
  status: CameraStatus;
}
