import { ApiProperty } from '@nestjs/swagger';
import { Intercom } from '../entities/intercom.entity';
import { IntercomStatus } from 'src/shared/types/enums';

export class IntercomDto {
  @ApiProperty()
  model: string;

  @ApiProperty()
  status: IntercomStatus;

  @ApiProperty()
  created_at: string;
}

export class ResponseIntercomDto {
  @ApiProperty({ description: 'Success status of the request' })
  success: true;

  @ApiProperty({ description: 'HTTP status code' })
  code: number;

  @ApiProperty({ description: 'Array of intercom data', type: [Intercom] })
  data: Intercom[];

  @ApiProperty({ description: 'Message of the response' })
  message: string;
}
