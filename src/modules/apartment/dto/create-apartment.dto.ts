import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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
}
