import { ApiProperty } from '@nestjs/swagger';
// import { Region } from '../../../modules/region/entities/region.entity';

export class UserDto {
  @ApiProperty()
  fullname: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  apartmentId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  // @ApiProperty()
  // region: Region;
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
