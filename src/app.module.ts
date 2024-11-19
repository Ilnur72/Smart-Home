import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './shared/core/core.modules';
import { UserModule } from './modules/user/user.module';
import { BuildingModule } from './modules/building/building.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [CoreModule, UserModule, BuildingModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
