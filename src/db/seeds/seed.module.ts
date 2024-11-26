import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Region } from '../../modules/region/entities/region.entity';
import { District } from '../../modules/district/entities/district.entity';
import { RegionService } from '../../modules/region/region.service';
import { MessageService } from '../../i18n/message.service';
import { SystemUser } from '../../modules/system-users/entities/systemUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Region, District, SystemUser])],
  providers: [SeedService, RegionService, MessageService],
})
export class SeedModule {}
