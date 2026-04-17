import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { XaiImageService } from '../../providers/xai-image/xai-image.service';
import { FileStorageService } from '../../providers/file-storage/file-storage.service';

type PromptsFile = Record<string, { moods: Record<string, string[]> }>;
type I18nFile = Record<
  string,
  { moods: Record<string, { messages: unknown[]; imageUrls: string[] }> }
>;

const I18N_DIR = path.join(__dirname, '../../i18n/ro');

interface PromptEntry {
  prompt: string;
  category: string;
  name: string;
  timeOfDay: string;
  mood: string;
  promptIndex: number;
}

function loadPrompts(): PromptEntry[] {
  const promptsDir = path.join(__dirname, 'prompts');
  const prompts: PromptEntry[] = [];

  function walk(dir: string, category: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, entry.name);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        const name = path.basename(entry.name, '.json');
        const data = JSON.parse(
          fs.readFileSync(fullPath, 'utf-8'),
        ) as PromptsFile;
        for (const [timeOfDay, { moods }] of Object.entries(data)) {
          for (const [mood, moodList] of Object.entries(moods)) {
            moodList.forEach((prompt, promptIndex) => {
              prompts.push({
                prompt,
                category,
                name,
                timeOfDay,
                mood,
                promptIndex,
              });
            });
          }
        }
      }
    }
  }

  walk(promptsDir, '');
  return prompts;
}

const PROMPTS = loadPrompts();

@Injectable()
export class BgImagesSeedService {
  private readonly logger = new Logger(BgImagesSeedService.name);

  constructor(
    private readonly xaiImageService: XaiImageService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async run(): Promise<void> {
    this.logger.log(`Seeding ${PROMPTS.length} background image(s)...`);

    await Promise.all(PROMPTS.map((entry, i) => this.seedOne(entry, i)));

    this.logger.log('Seed complete.');
  }

  private async seedOne(entry: PromptEntry, index: number): Promise<void> {
    const prefix = `[${index + 1}/${PROMPTS.length}]`;
    this.logger.log(`${prefix} Generating image...`);

    const imageBuffer = await this.xaiImageService.generateImage(entry.prompt);

    const filename = `ai/${entry.category}_${entry.name}_${entry.timeOfDay}_${entry.mood}_${entry.promptIndex}.jpg`;

    this.logger.log(`${prefix} Uploading as ${filename}`);

    const url = await this.fileStorageService.uploadFile(
      imageBuffer,
      filename,
      'image/jpeg',
    );

    const i18nPath = path.join(I18N_DIR, entry.category, `${entry.name}.json`);
    const i18nData = JSON.parse(fs.readFileSync(i18nPath, 'utf-8')) as I18nFile;
    i18nData[entry.timeOfDay].moods[entry.mood].imageUrls.push(url);
    fs.writeFileSync(i18nPath, JSON.stringify(i18nData, null, 2));

    this.logger.log(`${prefix} Done: ${url}`);
  }
}
