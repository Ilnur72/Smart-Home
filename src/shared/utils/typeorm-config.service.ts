import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ENV } from '../constants/env';
import { NodeEnv } from '../constants/node-env';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get(ENV.DB_CLIENT),
      url: this.configService.get(ENV.DB_URL),
      autoLoadEntities: true,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: this.configService.get(ENV.NODE_ENV) !== NodeEnv.PRODUCTION,
      timezone: '+05:00',
    } as TypeOrmModuleOptions;
  }
}
