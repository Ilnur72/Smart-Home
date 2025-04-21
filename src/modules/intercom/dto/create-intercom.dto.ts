import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { IntercomStatus } from '../../../shared/types/enums';

export class CreateIntercomDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ip: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sip: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  stream_link: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  entrance_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ enum: IntercomStatus })
  @IsNotEmpty()
  @IsEnum(IntercomStatus)
  status: IntercomStatus;
}
