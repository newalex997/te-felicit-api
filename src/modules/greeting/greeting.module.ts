import { Module } from '@nestjs/common';
import { GreetingContextModule } from '../../providers/greeting-context/greeting-context.module';
import { GreetingController } from './greeting.controller';
import { GreetingService } from './greeting.service';

@Module({
  imports: [GreetingContextModule],
  controllers: [GreetingController],
  providers: [GreetingService],
})
export class GreetingModule {}
