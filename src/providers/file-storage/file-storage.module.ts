import { Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { StorageConfigModule } from '../../common/config/storage/configuration.module';

@Module({
  imports: [StorageConfigModule],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
