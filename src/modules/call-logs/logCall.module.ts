import { LogCallController } from './logCall.controller';
import { Module } from '@nestjs/common';
import { LogCallService } from './logCall.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallLog } from './entities/call-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CallLog])],
  controllers: [LogCallController],
  providers: [LogCallService],
})
export class logCallModule {}
