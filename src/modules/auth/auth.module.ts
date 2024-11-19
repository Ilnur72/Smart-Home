import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { MessageService } from '../../i18n/message.service';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
// import { EskizService } from '../eskiz/eskiz.service';
// import { EskizModule } from '../eskiz/eskiz.module';
// import { Eskiz } from '../eskiz/entities/eskiz.entity';
// import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
