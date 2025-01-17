import { ApiProperty } from '@nestjs/swagger';
import { LocationDto } from '../../../shared/dto/location.dto';

export class BuildingDto {
  @ApiProperty()
  name: string;

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
  location: LocationDto;

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
