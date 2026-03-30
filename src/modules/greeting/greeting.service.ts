import { Injectable } from '@nestjs/common';
import {
  GreetingContext,
  GreetingContextService,
} from '../../providers/greeting-context/greeting-context.service';
import {
  OCCASION_IMAGE_URLS,
  OCCASION_MESSAGES,
  SEASON_TIME_IMAGE_URLS,
  SEASON_TIME_MESSAGES,
} from './greeting.constants';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickImage(context: GreetingContext): string {
  if (context.occasion) {
    const occasionPool = OCCASION_IMAGE_URLS[context.occasion];
    if (occasionPool) return pickRandom(occasionPool);
  }
  return pickRandom(SEASON_TIME_IMAGE_URLS[context.season][context.timeOfDay]);
}

function buildMessage(context: GreetingContext): string {
  const seasonTimeMessage = pickRandom(
    SEASON_TIME_MESSAGES[context.season][context.timeOfDay],
  );
  if (!context.occasion) return seasonTimeMessage;

  const occasionPool = OCCASION_MESSAGES[context.occasion];
  if (!occasionPool) return seasonTimeMessage;

  const occasionMessage = pickRandom(occasionPool);
  return `${occasionMessage} ${seasonTimeMessage}`;
}

@Injectable()
export class GreetingService {
  constructor(
    private readonly greetingContextService: GreetingContextService,
  ) {}

  getGreeting(): { message: string; imageUrl: string } {
    const context = this.greetingContextService.getContext();
    return {
      message: buildMessage(context),
      imageUrl: pickImage(context),
    };
  }

  getMessage(): { message: string } {
    const context = this.greetingContextService.getContext();
    return { message: buildMessage(context) };
  }

  getImage(): { imageUrl: string } {
    const context = this.greetingContextService.getContext();
    return { imageUrl: pickImage(context) };
  }
}
