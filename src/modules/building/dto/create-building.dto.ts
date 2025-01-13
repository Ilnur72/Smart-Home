import { ApiProperty } from '@nestjs/swagger';
import {
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { LocationDto } from 'src/shared/dto/location.dto';

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
  @IsOptional()
  location?: LocationDto;

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
