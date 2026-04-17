import { Injectable, Logger } from '@nestjs/common';
import { XaiImageService } from '../../providers/xai-image/xai-image.service';
import { FileStorageService } from '../../providers/file-storage/file-storage.service';

const PROMPTS = [
  'A beautiful soft nature background suitable for a greeting card, pastel colors, peaceful and warm atmosphere, no text',
  'Soft floral background with gentle bokeh, warm golden light, suitable for a birthday greeting card, no text',
  'Minimalist watercolor abstract background in soft blues and pinks, elegant and calm, greeting card style, no text',
  'Dreamy sunset over rolling hills, warm pastel tones, suitable for a heartfelt greeting card, no text',
];

@Injectable()
export class BgImagesSeedService {
  private readonly logger = new Logger(BgImagesSeedService.name);

  constructor(
    private readonly xaiImageService: XaiImageService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async run(count: number): Promise<void> {
    this.logger.log(`Seeding ${count} background image(s)...`);

    await Promise.all(
      Array.from({ length: count }, (_, i) => this.seedOne(i, count)),
    );

    this.logger.log('Seed complete.');
  }

  private async seedOne(index: number, total: number): Promise<void> {
    const prompt = PROMPTS[index % PROMPTS.length];
    this.logger.log(`[${index + 1}/${total}] Generating image...`);

    const imageBuffer = await this.xaiImageService.generateImage(prompt);

    const filename = `ai/bg_seed_${Date.now()}_${index}.jpg`;
    this.logger.log(`[${index + 1}/${total}] Uploading as ${filename}`);

    const url = await this.fileStorageService.uploadFile(
      imageBuffer,
      filename,
      'image/jpeg',
    );
    this.logger.log(`[${index + 1}/${total}] Done: ${url}`);
  }
}
