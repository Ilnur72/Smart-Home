import { TypeOrmModule } from '@nestjs/typeorm';
import { OperatorService } from './operator.service';
import { Module } from '@nestjs/common';
import { MessageService } from '../../i18n/message.service';
import { OperatorController } from './operator.controller';
import { Operator } from './entities/operator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operator])],
  controllers: [OperatorController],
  providers: [OperatorService, MessageService],
})
export class OperatorModule {}
