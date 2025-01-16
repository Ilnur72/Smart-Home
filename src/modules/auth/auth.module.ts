import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { MessageService } from '../../i18n/message.service';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Operator } from '../operator/entities/operator.entity';
import { SystemUser } from '../system-users/entities/systemUser.entity';
import { OperatorUser } from '../operator-users/entities/operatorUser.entity';
import { BaseUser } from '../../shared/entities/base-staff.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
// import { EskizService } from '../eskiz/eskiz.service';
// import { EskizModule } from '../eskiz/eskiz.module';
// import { Eskiz } from '../eskiz/entities/eskiz.entity';
// import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Operator,
      OperatorUser,
      SystemUser,
      BaseUser,
      UserAuth,
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    // HttpModule,
    // EskizModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    // EskizService,
    MessageService,
  ],
})
export class AuthModule {}
