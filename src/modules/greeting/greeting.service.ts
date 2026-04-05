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

  private t(key: string, lang: string): string[] {
    return this.i18n.t(key, { lang }) ?? [];
  }

  private buildGreeting(
    context: GreetingContext,
    lang: string,
  ): { message: string; slogan: string | null } {
    const wk = weekKey(context.weekOfYear);
    const weekMessages = this.t(
      `greeting.weeks.${wk}.${context.timeOfDay}.messages`,
      lang,
    );
    const weekSlogans = this.t(
      `greeting.weeks.${wk}.${context.timeOfDay}.slogans`,
      lang,
    );

    if (!context.occasion) {
      return {
        message: pickRandom(weekMessages),
        slogan: pickRandom(weekSlogans),
      };
    }

    const holidayMessages = this.t(
      `greeting.holidays.${context.occasion}.${context.timeOfDay}.messages`,
      lang,
    );
    const holidaySlogans = this.t(
      `greeting.holidays.${context.occasion}.${context.timeOfDay}.slogans`,
      lang,
    );

    const allMessages = [...weekMessages, ...holidayMessages];
    const allSlogans = [...weekSlogans, ...holidaySlogans];

    return {
      message: allMessages.length ? pickRandom(allMessages) : '',
      slogan: allSlogans.length ? pickRandom(allSlogans) : null,
    };
  }

  getGreeting(lang: string): {
    message: string;
    slogan: string | null;
    imageUrl: string;
  } {
    const context = this.greetingContextService.getContext();
    const { message, slogan } = this.buildGreeting(context, lang);
    return { message, slogan, imageUrl: pickImage(context) };
  }

  getMessage(lang: string): { message: string; slogan: string | null } {
    const context = this.greetingContextService.getContext();
    return this.buildGreeting(context, lang);
  }

  getImage(): { imageUrl: string } {
    const context = this.greetingContextService.getContext();
    return { imageUrl: pickImage(context) };
  }
}
