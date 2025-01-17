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
import { SystemUserModule } from './modules/system-users/systemUser.module';
import { ApartmentModule } from './modules/apartment/apartment.module';
import { IntercomModule } from './modules/intercom/intercom.module';
import { CameraModule } from './modules/camera/camera.module';
import { EntranceModule } from './modules/entrance/entrance.module';
import { UserApartmentModule } from './modules/user-apartment/user-apartment.module';

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
    SystemUserModule,
    ApartmentModule,
    IntercomModule,
    CameraModule,
    EntranceModule,
    UserApartmentModule,
  ],
})
export class AppModule {}
