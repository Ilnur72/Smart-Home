import { ApiProperty } from '@nestjs/swagger';

export class RegionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: string;
}

export class ResponseRegionDto {
  @ApiProperty({ description: 'Success status of the request' })
  success: true;

  @ApiProperty({ description: 'HTTP status code' })
  code: number;

  @ApiProperty({ description: 'Array of region data', type: [RegionDto] })
  data: RegionDto[];

  @ApiProperty({ description: 'Message of the response' })
  message: string;
}
