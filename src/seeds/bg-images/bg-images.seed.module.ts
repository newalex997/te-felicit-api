import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { XaiImageModule } from '../../providers/xai-image/xai-image.module';
import { FileStorageModule } from '../../providers/file-storage/file-storage.module';
import xaiConfiguration from '../../common/config/xai/configuration';
import storageConfiguration from '../../common/config/storage/configuration';
import { BgImagesSeedService } from './bg-images.seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [xaiConfiguration, storageConfiguration],
    }),
    XaiImageModule,
    FileStorageModule,
  ],
  providers: [BgImagesSeedService],
})
export class BgImagesSeedModule {}
