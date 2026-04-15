import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  GreetingContext,
  GreetingContextService,
} from '../../providers/greeting-context/greeting-context.service';
import { GreetingResponseDto } from './dto/greeting-response.dto';
import { GreetingMessageResponseDto } from './dto/greeting-message-response.dto';
import { GreetingImageResponseDto } from './dto/greeting-image-response.dto';
import { MoodOptionsResponseDto } from './dto/mood-option.dto';
import { GreetingTextConfigDto } from './dto/text-block-config.dto';
import { MOODS, DEFAULT_TEXT_CONFIG, TEXT_CONFIGS } from './greeting.constants';

interface GreetingMessageEntry {
  text: string;
  slogans: string[];
  textConfigId?: number;
  textConfig?: GreetingTextConfigDto;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weekKey(weekOfYear: number): string {
  return `week_${String(weekOfYear).padStart(2, '0')}`;
}

@Injectable()
export class GreetingService {
  constructor(
    private readonly greetingContextService: GreetingContextService,
    private readonly i18n: I18nService,
  ) {}

  private getI18nArray<T>(key: string, lang: string): T[] {
    const result = this.i18n.t(key, { lang });
    return Array.isArray(result) ? (result as T[]) : [];
  }

  private resolveTextConfig(
    entry: GreetingMessageEntry,
  ): GreetingTextConfigDto {
    if (entry.textConfig) return entry.textConfig;
    if (entry.textConfigId != null) {
      const config: GreetingTextConfigDto | undefined = (
        TEXT_CONFIGS as Record<number, GreetingTextConfigDto | undefined>
      )[entry.textConfigId];
      if (config) return config;
    }
    return DEFAULT_TEXT_CONFIG;
  }

  private effectiveMood(mood?: string): string {
    const validMoods = MOODS.filter((m) => m.id !== 'all').map((m) => m.id);
    return mood && validMoods.includes(mood) ? mood : 'joyful';
  }

  private pickImage(
    context: GreetingContext,
    lang: string,
    mood?: string,
  ): string {
    const effectiveMood = this.effectiveMood(mood);
    const urls = this.getI18nArray<string>(
      `weeks.${weekKey(context.weekOfYear)}.${context.timeOfDay}.moods.${effectiveMood}.imageUrls`,
      lang,
    );
    return pickRandom(urls);
  }

  private buildGreeting(
    context: GreetingContext,
    lang: string,
    mood?: string,
  ): GreetingMessageResponseDto {
    const wk = weekKey(context.weekOfYear);
    const effectiveMood = this.effectiveMood(mood);

    const weekEntries = this.getI18nArray<GreetingMessageEntry>(
      `weeks.${wk}.${context.timeOfDay}.moods.${effectiveMood}.messages`,
      lang,
    );

    const occasionEntries = context.occasion
      ? this.getI18nArray<GreetingMessageEntry>(
          `holidays.${context.occasion}.${context.timeOfDay}.moods.${effectiveMood}.messages`,
          lang,
        )
      : [];

    const pool = [...weekEntries, ...occasionEntries];

    if (pool.length === 0) {
      throw new InternalServerErrorException(
        `No greeting content found for week=${wk}, timeOfDay=${context.timeOfDay}, mood=${effectiveMood}`,
      );
    }

    const entry = pickRandom(pool);
    return {
      message: entry.text,
      slogan: pickRandom(entry.slogans),
      textConfig: this.resolveTextConfig(entry),
    };
  }

  getGreeting(lang: string, mood?: string): GreetingResponseDto {
    const context = this.greetingContextService.getContext();

    return {
      ...this.buildGreeting(context, lang, mood),
      imageUrl: this.pickImage(context, lang, mood),
    };
  }

  getMessage(lang: string, mood?: string): GreetingMessageResponseDto {
    const context = this.greetingContextService.getContext();

    return this.buildGreeting(context, lang, mood);
  }

  getImage(lang: string): GreetingImageResponseDto {
    const context = this.greetingContextService.getContext();

    return { imageUrl: this.pickImage(context, lang) };
  }

  getMoods(lang: string): MoodOptionsResponseDto {
    const moods = MOODS.map((mood) => ({
      ...mood,
      label: String(this.i18n.t(`moods.${mood.id}`, { lang })),
    }));
    return { moods };
  }
}
