import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { I18nModule } from '../providers/i18n/i18n.module';
import { ApiConfigModule } from '../common/config/api/configuration.module';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
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
  providers: [
    LoggingProvider,
    RateLimitProvider,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
