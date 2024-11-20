import { CreateOperatorUserDto } from './create-operatorUser.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateOperatorUserDto extends PartialType(CreateOperatorUserDto) {}
