import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { IntercomStatus } from '../../../shared/types/enums';

export class CreateIntercomDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({ enum: IntercomStatus })
  @IsNotEmpty()
  @IsEnum(IntercomStatus)
  status: IntercomStatus;
}
