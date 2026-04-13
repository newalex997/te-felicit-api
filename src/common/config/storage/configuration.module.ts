import { Module } from '@nestjs/common';
import { StorageConfigService } from './configuration.service';

@Module({
  providers: [StorageConfigService],
  exports: [StorageConfigService],
})
export class StorageConfigModule {}
