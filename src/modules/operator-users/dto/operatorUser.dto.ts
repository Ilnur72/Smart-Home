import { ApiProperty } from '@nestjs/swagger';
// import { Region } from '../../../modules/region/entities/region.entity';

export class OperatorUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  operator_id: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  created_at: Date;
}

export class ResponseOperatorUserDto {
  @ApiProperty({ description: 'Success status of the request' })
  success: true;

  @ApiProperty({ description: 'HTTP status code' })
  code: number;

  @ApiProperty({
    description: 'Array of operatorUser data',
    type: [OperatorUserDto],
  })
  data: OperatorUserDto[];

  @ApiProperty({ description: 'Message of the response' })
  message: string;
}
