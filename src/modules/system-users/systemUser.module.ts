import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUserService } from './systemUser.service';
import { SystemUserController } from './systemUser.controller';
import { SystemUser } from './entities/systemUser.entity';
import { MessageService } from '../../i18n/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemUser])],
  controllers: [SystemUserController],
  providers: [SystemUserService, MessageService],
  exports: [SystemUserService],
})
export class SystemUserModule {}
