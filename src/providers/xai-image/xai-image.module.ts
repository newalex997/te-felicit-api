import { Module } from '@nestjs/common';
import { XaiImageService } from './xai-image.service';
import { XaiConfigModule } from '../../common/config/xai/configuration.module';

@Module({
  imports: [XaiConfigModule],
  providers: [XaiImageService],
  exports: [XaiImageService],
})
export class XaiImageModule {}
