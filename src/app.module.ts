import { Module } from '@nestjs/common';
import { CoreModule } from './shared/core/core.modules';
import { UserModule } from './modules/user/user.module';
import { BuildingModule } from './modules/building/building.module';
import { AuthModule } from './modules/auth/auth.module';
import { RegionModule } from './modules/region/region.module';
import { DistrictModule } from './modules/district/district.module';
import { SeedModule } from './db/seeds/seed.module';
import { OperatorModule } from './modules/operator/operator.module';
import { OperatorUserModule } from './modules/operator-users/operatorUser.module';

@Module({
  imports: [
    CoreModule,
    UserModule,
    BuildingModule,
    AuthModule,
    RegionModule,
    DistrictModule,
    SeedModule,
    OperatorUserModule,
    OperatorModule,
  ],
})
export class AppModule {}
