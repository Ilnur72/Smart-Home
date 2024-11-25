import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateApartmentDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  entrance_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  intercom_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  apartments_number: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  number: number;
}
