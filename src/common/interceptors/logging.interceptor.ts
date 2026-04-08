import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req: Request = context.switchToHttp().getRequest();

    if (req.path === '/health' || req.path === '/metrics') {
      return next.handle();
    }

    const { method, path, ip } = req;
    const userAgent = req.get('user-agent') ?? '';
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `${method} ${path} ${ip} ${userAgent} — ${Date.now() - start}ms`,
        );
      }),
    );
  }
}
