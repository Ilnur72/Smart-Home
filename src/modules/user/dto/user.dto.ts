import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  fullname: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  created_at: Date;
}

export class ResponseUserDto {
  @ApiProperty({ description: 'Success status of the request' })
  success: true;

  @ApiProperty({ description: 'HTTP status code' })
  code: number;

  @ApiProperty({ description: 'Array of user data', type: [UserDto] })
  data: UserDto[];

  @ApiProperty({ description: 'Message of the response' })
  message: string;
}
