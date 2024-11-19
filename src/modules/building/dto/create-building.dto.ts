import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateBuildingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  floor: number;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  entrance_id: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  operator_id: string;
}
