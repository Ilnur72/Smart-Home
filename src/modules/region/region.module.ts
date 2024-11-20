import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from './entities/region.entity';
import { MessageService } from '../../i18n/message.service';
import { DistrictService } from '../district/district.service';
import { District } from '../district/entities/district.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Region, District])],
  controllers: [RegionController],
  providers: [RegionService, MessageService, DistrictService],
})
export class RegionModule {}
