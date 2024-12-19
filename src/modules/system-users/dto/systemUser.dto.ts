import { ApiProperty } from '@nestjs/swagger';
// import { Region } from '../../../modules/region/entities/region.entity';

export class SystemUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  created_at: Date;
}

export class ResponseSystemUserDto {
  @ApiProperty({ description: 'Success status of the request' })
  success: true;

  @ApiProperty({ description: 'HTTP status code' })
  code: number;

  @ApiProperty({
    description: 'Array of system user data',
    type: [SystemUserDto],
  })
  data: SystemUserDto[];

  @ApiProperty({ description: 'Message of the response' })
  message: string;
}
