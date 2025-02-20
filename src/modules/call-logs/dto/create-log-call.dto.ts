import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CallData {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  caller: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  dest: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  answerTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  billAbleSeconds: number;
}

export class CreateLogCallDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(['Cancelled', 'Busy', 'Answered'])
  status: 'Cancelled' | 'Busy' | 'Answered';

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CallData)
  data: CallData;
}
