import { Module } from '@nestjs/common';
import { GreetingContextService } from './greeting-context.service';

@Module({
  providers: [GreetingContextService],
  exports: [GreetingContextService],
})
export class GreetingContextModule {}
