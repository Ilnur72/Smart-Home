import { ApiProperty } from '@nestjs/swagger';
// import { Region } from '../../../modules/region/entities/region.entity';

export class OperatorDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  created_at: Date;
}

export class ResponseOperatorDto {
  @ApiProperty({ description: 'Success status of the request' })
  success: true;

  @ApiProperty({ description: 'HTTP status code' })
  code: number;

  @ApiProperty({ description: 'Array of user data', type: [OperatorDto] })
  data: OperatorDto[];

  @ApiProperty({ description: 'Message of the response' })
  message: string;
}
