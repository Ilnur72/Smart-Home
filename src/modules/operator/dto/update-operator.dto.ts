import { CreateOperatorDto } from './create-operator.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateOperatorDto extends PartialType(CreateOperatorDto) {}
