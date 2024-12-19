import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configService from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../utils/typeorm-config.service';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt_secret'),
        signOptions: {
          expiresIn: configService.get('jwt_expiration', '24h'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CacheModule.registerAsync<CacheModuleOptions>({
      useFactory: () => ({
        store: redisStore,
        url: 'redis://default:DvFWylDVXoFJxNyDPdnXmMIsRRyVBFrr@junction.proxy.rlwy.net:34191',
        // host: process.env.REDIS_HOST,
        // port: process.env.REDIS_PORT,
        // ttl: 60, // Standart TTL (sekundda)
      }),
    }),
  ],
  exports: [ConfigModule, TypeOrmModule, CacheModule],
})
export class CoreModule {}
