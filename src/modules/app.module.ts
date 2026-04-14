import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { I18nModule } from '../providers/i18n/i18n.module';
import { ApiConfigModule } from '../common/config/api/configuration.module';
import { LoggingProvider } from '../providers/logging/logging.provider';
import { RateLimitProvider } from '../providers/rate-limit/rate-limit.provider';
import { GreetingModule } from './greeting/greeting.module';

@Module({
  imports: [
    ApiConfigModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    I18nModule,
    GreetingModule,
  ],
  providers: [LoggingProvider, RateLimitProvider],
})
export class AppModule {}
