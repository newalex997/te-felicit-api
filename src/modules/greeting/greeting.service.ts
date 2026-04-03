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

@Injectable()
export class GreetingService {
  constructor(
    private readonly greetingContextService: GreetingContextService,
    private readonly i18n: I18nService,
  ) {}

  private buildMessage(context: GreetingContext, lang: string): string {
    const seasonMessages: string[] = this.i18n.t(
      `greeting.season.${context.season}.${context.timeOfDay}`,
      { lang },
    );
    const seasonTimeMessage = pickRandom(seasonMessages);

    if (!context.occasion) return seasonTimeMessage;

    const occasionMessages: string[] | null = this.i18n.t(
      `greeting.occasion.${context.occasion}`,
      { lang },
    );
    if (!occasionMessages?.length) return seasonTimeMessage;

    return `${pickRandom(occasionMessages)} ${seasonTimeMessage}`;
  }

  getGreeting(lang: string): { message: string; imageUrl: string } {
    const context = this.greetingContextService.getContext();
    return {
      message: this.buildMessage(context, lang),
      imageUrl: pickImage(context),
    };
  }

  getMessage(lang: string): { message: string } {
    const context = this.greetingContextService.getContext();
    return { message: this.buildMessage(context, lang) };
  }

  getImage(): { imageUrl: string } {
    const context = this.greetingContextService.getContext();
    const imageUrl = pickImage(context);

    console.log(`Selected image URL: ${imageUrl} for context:`, context);
    return { imageUrl };
  }
}
