import { ApiProperty } from '@nestjs/swagger';

export class ApartmentDto {
  @ApiProperty()
  entrance_id: string;

  @ApiProperty()
  intercom_id: string;

  @ApiProperty()
  apartments_count: number;

  @ApiProperty()
  number: string;
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
