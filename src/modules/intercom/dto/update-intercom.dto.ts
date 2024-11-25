import { PartialType } from '@nestjs/swagger';
import { CreateIntercomDto } from './create-intercom.dto';

export class UpdateIntercomDto extends PartialType(CreateIntercomDto) {}
