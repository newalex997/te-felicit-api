import { Module } from '@nestjs/common';
import { XaiConfigService } from './configuration.service';

@Module({
  providers: [XaiConfigService],
  exports: [XaiConfigService],
})
export class XaiConfigModule {}
