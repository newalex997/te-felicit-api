import { Injectable } from '@nestjs/common';
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
import { MOODS, DEFAULT_TEXT_CONFIG } from './greeting.constants';

interface GreetingMessageEntry {
  text: string;
  slogans: string[];
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

  private pickImage(context: GreetingContext, lang: string): string {
    const urls = this.getI18nArray<string>(
      `greeting.weeks.${weekKey(context.weekOfYear)}.${context.timeOfDay}.imageUrls`,
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
    const weekEntries = this.getI18nArray<GreetingMessageEntry>(
      `greeting.weeks.${wk}.${context.timeOfDay}.messages`,
      lang,
    );

    const occasionEntries = context.occasion
      ? this.getI18nArray<GreetingMessageEntry>(
          `holidays.${context.occasion}.${context.timeOfDay}.messages`,
          lang,
        )
      : [];

    const moodEntries =
      mood && mood !== 'all'
        ? this.getI18nArray<GreetingMessageEntry>(
            `moods.${mood}.messages`,
            lang,
          )
        : [];

    const pool = [...weekEntries, ...occasionEntries, ...moodEntries];

    const entry = pickRandom(pool);
    return {
      message: entry.text,
      slogan: pickRandom(entry.slogans),
      textConfig: entry.textConfig ?? DEFAULT_TEXT_CONFIG,
    };
  }

  getGreeting(lang: string, mood?: string): GreetingResponseDto {
    const context = this.greetingContextService.getContext();

    return {
      ...this.buildGreeting(context, lang, mood),
      imageUrl: this.pickImage(context, lang),
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

  getMoods(): MoodOptionsResponseDto {
    return { moods: MOODS };
  }
}
