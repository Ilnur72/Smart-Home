import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApartmentStatus } from '../../../shared/types/enums';

export class CreateApartmentDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  entrance_id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  intercom_id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ApartmentStatus)
  status: ApartmentStatus;
}
