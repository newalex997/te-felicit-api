import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { createXai } from '@ai-sdk/xai';
import { generateImage } from 'ai';
import { XaiConfigService } from '../../common/config/xai/configuration.service';

@Injectable()
export class XaiImageService {
  private readonly logger = new Logger(XaiImageService.name);

  constructor(private readonly xaiConfig: XaiConfigService) {}

  async generateImage(prompt: string): Promise<Buffer> {
    try {
      const xai = createXai({ apiKey: this.xaiConfig.apiKey });

      const { image } = await generateImage({
        model: xai.image(this.xaiConfig.imageModel),
        aspectRatio: '3:4',
        prompt,
      });

      return Buffer.from(image.uint8Array);
    } catch (error) {
      this.logger.error('xAI image generation failed', error);
      throw new InternalServerErrorException('xAI image generation failed');
    }
  }
}
