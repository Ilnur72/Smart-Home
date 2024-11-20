import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ default: '998901234567' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone: string;

  @IsString()
  @IsOptional()
  password?: string;
}

export class VerifyDto {
  @ApiProperty()
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  code: number;
}