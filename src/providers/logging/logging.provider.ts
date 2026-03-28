import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';

export const LoggingProvider = {
  provide: APP_INTERCEPTOR,
  useClass: LoggingInterceptor,
};
