import { TypeOrmModule } from '@nestjs/typeorm';
import { OperatorUserService } from './operatorUser.service';
import { Module } from '@nestjs/common';
import { MessageService } from '../../i18n/message.service';
import { OperatorUserController } from './operatorUser.controller';
import { OperatorUser } from './entities/operatorUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OperatorUser])],
  controllers: [OperatorUserController],
  providers: [OperatorUserService, MessageService],
})
export class OperatorUserModule {}
