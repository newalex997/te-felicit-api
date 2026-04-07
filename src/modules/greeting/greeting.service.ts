import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  GreetingContext,
  GreetingContextService,
} from '../../providers/greeting-context/greeting-context.service';
import {
  OCCASION_IMAGE_URLS,
  MONTH_TIME_IMAGE_URLS,
} from './greeting.constants';
import { GreetingResponseDto } from './dto/greeting-response.dto';
import { GreetingMessageResponseDto } from './dto/greeting-message-response.dto';
import { GreetingImageResponseDto } from './dto/greeting-image-response.dto';
import {
  GreetingTextConfigDto,
  TextPosition,
} from './dto/text-block-config.dto';

interface GreetingMessageEntry {
  text: string;
  slogans: string[];
  textConfig?: GreetingTextConfigDto;
}

const DEFAULT_TEXT_CONFIG: GreetingTextConfigDto = {
  message: {
    fontSize: 24,
    color: '#FFFFFF',
    position: TextPosition.CENTER,
  },
  slogan: {
    fontSize: 48,
    color: '#FFFFFFCC',
    position: TextPosition.BOTTOM_CENTER,
  },
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickImage(context: GreetingContext): string {
  if (context.occasion) {
    const occasionPool = OCCASION_IMAGE_URLS[context.occasion];
    if (occasionPool) return pickRandom(occasionPool[context.timeOfDay]);
  }
  return pickRandom(MONTH_TIME_IMAGE_URLS[context.month][context.timeOfDay]);
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

  private getMessageEntries(key: string, lang: string): GreetingMessageEntry[] {
    const result = this.i18n.t(key, { lang });
    return Array.isArray(result) ? (result as GreetingMessageEntry[]) : [];
  }

  private buildGreeting(
    context: GreetingContext,
    lang: string,
  ): GreetingMessageResponseDto {
    const wk = weekKey(context.weekOfYear);
    const weekEntries = this.getMessageEntries(
      `greeting.weeks.${wk}.${context.timeOfDay}.messages`,
      lang,
    );

    if (!context.occasion) {
      const entry = pickRandom(weekEntries);
      return {
        message: entry.text,
        slogan: pickRandom(entry.slogans),
        textConfig: entry.textConfig ?? DEFAULT_TEXT_CONFIG,
      };
    }

    const holidayEntries = this.getMessageEntries(
      `greeting.holidays.${context.occasion}.${context.timeOfDay}.messages`,
      lang,
    );

    const allEntries = [...weekEntries, ...holidayEntries];
    const entry = pickRandom(allEntries);
    return {
      message: entry.text,
      slogan: pickRandom(entry.slogans),
      textConfig: entry.textConfig ?? DEFAULT_TEXT_CONFIG,
    };
  }

  getGreeting(lang: string): GreetingResponseDto {
    const context = this.greetingContextService.getContext();
    const { message, slogan, textConfig } = this.buildGreeting(context, lang);

    return {
      message,
      slogan,
      imageUrl: pickImage(context),
      textConfig,
    };
  }

  getMessage(lang: string): GreetingMessageResponseDto {
    const context = this.greetingContextService.getContext();

    return this.buildGreeting(context, lang);
  }

  getImage(): GreetingImageResponseDto {
    const context = this.greetingContextService.getContext();

    return { imageUrl: pickImage(context) };
  }
}
