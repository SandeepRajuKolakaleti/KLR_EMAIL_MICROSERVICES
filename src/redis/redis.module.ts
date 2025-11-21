import {
  Inject,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { CACHE_MANAGER }  from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisCacheService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: +process.env.REDIS_PORT || 6379,
          ttl: 0,
        }),
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule implements OnModuleInit {
  constructor(
      @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}
  public onModuleInit(): any {
      const logger = new Logger('Cache');
  }
}
