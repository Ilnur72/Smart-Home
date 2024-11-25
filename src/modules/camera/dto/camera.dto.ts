import { ApiProperty } from '@nestjs/swagger';
import { Camera } from '../entities/camera.entity';
import { CameraStatus } from 'src/shared/types/enums';

export class CameraDto {
  @ApiProperty()
  building_id: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  location: Record<string, any>;

  @ApiProperty()
  ip_address: string;

  @ApiProperty({ enum: CameraStatus })
  status: CameraStatus;
}

export class ResponseCameraDto {
  @ApiProperty({ description: 'Success status of the request' })
  success: true;

  @ApiProperty({ description: 'HTTP status code' })
  code: number;

  @ApiProperty({ description: 'Array of camera data', type: [CameraDto] })
  data: CameraDto[];

  @ApiProperty({ description: 'Message of the response' })
  message: string;
}
