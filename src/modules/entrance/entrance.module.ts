import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntranceService } from './entrance.service';
import { EntranceController } from './entrance.controller';
import { Entrance } from './entities/entrance.entity';
import { MessageService } from '../../i18n/message.service';
import { Apartment } from '../apartment/entities/apartment.entity';
import { ApartmentService } from '../apartment/apartment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Entrance, Apartment])],
  controllers: [EntranceController],
  providers: [EntranceService, MessageService, ApartmentService],
  exports: [EntranceService],
})
export class EntranceModule {}
