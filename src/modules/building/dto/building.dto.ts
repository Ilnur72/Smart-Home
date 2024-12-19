import { ApiProperty } from '@nestjs/swagger';

export class BuildingDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  floor: number;

  @ApiProperty()
  entrance_count: number;

  @ApiProperty()
  apartments_count: number;

  @ApiProperty()
  operator_id: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  created_at: string;
}

export class ResponseBuildingDto {
  @ApiProperty({ description: 'Success status of the request' })
  success: true;

  @ApiProperty({ description: 'HTTP status code' })
  code: number;

  @ApiProperty({ description: 'Array of building data', type: [BuildingDto] })
  data: BuildingDto[];

  @ApiProperty({ description: 'Message of the response' })
  message: string;
}
