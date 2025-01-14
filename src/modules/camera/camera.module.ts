import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CameraService } from './camera.service';
import { CameraController } from './camera.controller';
import { Camera } from './entities/camera.entity';
import { MessageService } from '../../i18n/message.service';
import { EntranceService } from '../entrance/entrance.service';
import { Entrance } from '../entrance/entities/entrance.entity';
import { ApartmentService } from '../apartment/apartment.service';
import { Apartment } from '../apartment/entities/apartment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Camera, Entrance, Apartment])],
  controllers: [CameraController],
  providers: [CameraService, MessageService, EntranceService, ApartmentService],
  exports: [CameraService],
})
export class CameraModule {}
