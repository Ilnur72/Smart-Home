import { ApiProperty } from '@nestjs/swagger';

export class ApartmentDto {
  @ApiProperty()
  entrance_id: string;

  @ApiProperty()
  intercom_id: string;

  @ApiProperty()
  number: string;

  @ApiProperty()
  status: string;
}

export class ResponseApartmentDto {
  @ApiProperty({ description: 'Success status of the request' })
  success: true;

  @ApiProperty({ description: 'HTTP status code' })
  code: number;

  @ApiProperty({ description: 'Array of apartment data', type: [ApartmentDto] })
  data: ApartmentDto[];

  @ApiProperty({ description: 'Message of the response' })
  message: string;
}
