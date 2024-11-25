import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntranceService } from './entrance.service';
import { EntranceController } from './entrance.controller';
import { Entrance } from './entities/entrance.entity';
import { MessageService } from '../../i18n/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Entrance])],
  controllers: [EntranceController],
  providers: [EntranceService, MessageService],
  exports: [EntranceService],
})
export class EntranceModule {}
