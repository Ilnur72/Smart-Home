import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

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
  @IsNumber()
  @IsNotEmpty()
  floor: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  entrance_number: number;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  operator_id: string;
}
