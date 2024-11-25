import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentService } from './apartment.service';
import { ApartmentController } from './apartment.controller';
import { Apartment } from './entities/apartment.entity';
import { MessageService } from 'src/i18n/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Apartment])],
  controllers: [ApartmentController],
  providers: [ApartmentService, MessageService],
  exports: [ApartmentService],
})
export class ApartmentModule {}
