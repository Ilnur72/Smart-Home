import { PartialType } from '@nestjs/swagger';
import { CreateUserApartmentDto } from './create-user-apartment.dto';

export class UpdateUserApartmentDto extends PartialType(
  CreateUserApartmentDto,
) {}
