import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  GreetingContext,
  GreetingContextService,
} from '../../providers/greeting-context/greeting-context.service';
import { HolidayKey, MoodKey } from '../../common/typings/greeting.types';
import { GreetingResponseDto } from './dto/greeting-response.dto';
import { GreetingMessageResponseDto } from './dto/greeting-message-response.dto';
import { GreetingImageResponseDto } from './dto/greeting-image-response.dto';
import { MoodOptionsResponseDto } from './dto/mood-option.dto';
import { GreetingTextConfigDto } from './dto/text-block-config.dto';
import {
  MOODS,
  DEFAULT_TEXT_CONFIG,
  TEXT_CONFIGS,
  HOLIDAY_META,
} from './greeting.constants';

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
      const config = (
        TEXT_CONFIGS as Record<number, GreetingTextConfigDto | undefined>
      )[entry.textConfigId];
      if (config) return config;
    }
    return DEFAULT_TEXT_CONFIG;
  }

  private resolveMood(mood?: string): string | null {
    const valid = MOODS.filter((m) => m.id !== 'all').map((m) => m.id);
    if (!mood || mood === 'all' || !valid.includes(mood as MoodKey))
      return null;
    return mood;
  }

  private allMoodIds(): string[] {
    return MOODS.filter((m) => m.id !== 'all').map((m) => m.id);
  }

  private resolveHoliday(holiday?: string): HolidayKey | null {
    const valid = HOLIDAY_META.map((h) => h.id as HolidayKey);
    return holiday && valid.includes(holiday as HolidayKey)
      ? (holiday as HolidayKey)
      : null;
  }

  private toMessageResponse(
    entry: GreetingMessageEntry,
  ): GreetingMessageResponseDto {
    return {
      message: entry.text,
      slogan: pickRandom(entry.slogans),
      textConfig: this.resolveTextConfig(entry),
    };
  }

  private pickImage(
    context: GreetingContext,
    lang: string,
    mood: string | null,
    holiday: HolidayKey | null,
  ): string {
    const moodIds = mood ? [mood] : this.allMoodIds();

    if (holiday) {
      const urls = moodIds.flatMap((m) =>
        this.getI18nArray<string>(
          `holidays.${holiday}.${context.timeOfDay}.moods.${m}.imageUrls`,
          lang,
        ),
      );
      return pickRandom(urls);
    }

    const urls = moodIds.flatMap((m) =>
      this.getI18nArray<string>(
        `weeks.${weekKey(context.weekOfYear)}.${context.timeOfDay}.moods.${m}.imageUrls`,
        lang,
      ),
    );
    return pickRandom(urls);
  }

  private buildGreeting(
    context: GreetingContext,
    lang: string,
    mood: string | null,
    holiday: HolidayKey | null,
  ): GreetingMessageResponseDto {
    const moodIds = mood ? [mood] : this.allMoodIds();

    if (holiday) {
      const entries = moodIds.flatMap((m) =>
        this.getI18nArray<GreetingMessageEntry>(
          `holidays.${holiday}.${context.timeOfDay}.moods.${m}.messages`,
          lang,
        ),
      );
      if (entries.length > 0)
        return this.toMessageResponse(pickRandom(entries));
    }

    const wk = weekKey(context.weekOfYear);
    const weekEntries = moodIds.flatMap((m) =>
      this.getI18nArray<GreetingMessageEntry>(
        `weeks.${wk}.${context.timeOfDay}.moods.${m}.messages`,
        lang,
      ),
    );
    const occasionEntries = context.occasion
      ? moodIds.flatMap((m) =>
          this.getI18nArray<GreetingMessageEntry>(
            `holidays.${context.occasion}.${context.timeOfDay}.moods.${m}.messages`,
            lang,
          ),
        )
      : [];

    const pool = [...weekEntries, ...occasionEntries];

    if (pool.length === 0) {
      throw new InternalServerErrorException(
        `No greeting content found for week=${wk}, timeOfDay=${context.timeOfDay}, mood=${mood ?? 'all'}`,
      );
    }

    return this.toMessageResponse(pickRandom(pool));
  }

  getGreeting(
    lang: string,
    mood?: string,
    holiday?: string,
  ): GreetingResponseDto {
    const context = this.greetingContextService.getContext();
    const resolvedMood = this.resolveMood(mood);
    const resolvedHoliday = this.resolveHoliday(holiday);

    return {
      ...this.buildGreeting(context, lang, resolvedMood, resolvedHoliday),
      imageUrl: this.pickImage(context, lang, resolvedMood, resolvedHoliday),
    };
  }

  getMessage(
    lang: string,
    mood?: string,
    holiday?: string,
  ): GreetingMessageResponseDto {
    const context = this.greetingContextService.getContext();
    return this.buildGreeting(
      context,
      lang,
      this.resolveMood(mood),
      this.resolveHoliday(holiday),
    );
  }

  getImage(
    lang: string,
    mood?: string,
    holiday?: string,
  ): GreetingImageResponseDto {
    const context = this.greetingContextService.getContext();
    const resolvedMood = this.resolveMood(mood);
    const resolvedHoliday = this.resolveHoliday(holiday);

    return {
      imageUrl: this.pickImage(context, lang, resolvedMood, resolvedHoliday),
    };
  }

  getMoods(lang: string): MoodOptionsResponseDto {
    const holidayKeys = this.greetingContextService.getUpcomingOccasions(2);

    const moods = MOODS.map((mood) => ({
      ...mood,
      label: String(this.i18n.t(`moods.${mood.id}`, { lang })),
    }));

    const holidayMoods = HOLIDAY_META.filter(
      (h) => holidayKeys.includes(h.id as HolidayKey) || h.id === 'birthday',
    ).map((h) => ({
      ...h,
      label: String(this.i18n.t(`holiday_labels.${h.id}`, { lang })),
    }));

    return { moods, holidayMoods };
  }
}
