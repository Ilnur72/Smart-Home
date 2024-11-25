import { PartialType } from '@nestjs/mapped-types';
import { CreateSystemUserDto } from './create-systemUser.dto';

export class UpdateSystemUserDto extends PartialType(CreateSystemUserDto) {}
