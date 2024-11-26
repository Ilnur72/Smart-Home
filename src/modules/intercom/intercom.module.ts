import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntercomService } from './intercom.service';
import { IntercomController } from './intercom.controller';
import { Intercom } from './entities/intercom.entity';
import { MessageService } from '../../i18n/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Intercom])],
  controllers: [IntercomController],
  providers: [IntercomService, MessageService],
  exports: [IntercomService],
})
export class IntercomModule {}
