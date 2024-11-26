import { Module } from '@nestjs/common';
import { BuildingService } from './building.service';
import { BuildingController } from './building.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { MessageService } from '../../i18n/message.service';
import { EntranceService } from '../entrance/entrance.service';
import { ApartmentService } from '../apartment/apartment.service';
import { Entrance } from '../entrance/entities/entrance.entity';
import { Apartment } from '../apartment/entities/apartment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Building, Entrance, Apartment])],
  controllers: [BuildingController],
  providers: [
    BuildingService,
    MessageService,
    EntranceService,
    ApartmentService,
  ],
})
export class BuildingModule {}
