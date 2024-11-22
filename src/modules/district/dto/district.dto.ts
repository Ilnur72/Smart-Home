import { ApiProperty } from '@nestjs/swagger';

export class DistrictDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  region_id: string;

  @ApiProperty()
  created_at: string;
}

export class ResponseDistrictDto {
  @ApiProperty({ description: 'Success status of the request' })
  success: true;

  @ApiProperty({ description: 'HTTP status code' })
  code: number;

  @ApiProperty({ description: 'Array of district data', type: [DistrictDto] })
  data: DistrictDto[];

  @ApiProperty({ description: 'Message of the response' })
  message: string;
}
