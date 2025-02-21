import { ApiProperty } from '@nestjs/swagger';

export class EntranceDto {
  @ApiProperty()
  building_id: string;

  @ApiProperty()
  intercom_id: string;

  @ApiProperty()
  first_apartment_number: number;

  @ApiProperty()
  last_apartment_number: number;

  @ApiProperty()
  intercom_ip: number;

  @ApiProperty()
  stream_ip: string;

  @ApiProperty()
  intercom_login: number;

  @ApiProperty()
  intercom_password: number;

  @ApiProperty()
  camera_ids: string[];

  @ApiProperty()
  name: string;
}

export class ResponseEntranceDto {
  @ApiProperty({ description: 'Success status of the request' })
  success: true;

  @ApiProperty({ description: 'HTTP status code' })
  code: number;

  @ApiProperty({ description: 'Array of entrance data', type: [EntranceDto] })
  data: EntranceDto[];

  @ApiProperty({ description: 'Message of the response' })
  message: string;
}
