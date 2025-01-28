import { Module } from '@nestjs/common';
import { UserApartmentService } from './user-apartment.service';
import { UserApartmentController } from './user-apartment.controller';
import { UserApartment } from './entities/user-apartment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from '../../i18n/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserApartment])],
  controllers: [UserApartmentController],
  providers: [UserApartmentService, MessageService],
})
export class UserApartmentModule {}
