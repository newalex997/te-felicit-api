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
  PERMANENT_HOLIDAY_OPTIONS,
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

  // ─── i18n helpers ────────────────────────────────────────────────────────────

  private getI18nArray<T>(key: string, lang: string): T[] {
    const result = this.i18n.t(key, { lang });
    return Array.isArray(result) ? (result as T[]) : [];
  }

  private collectFromMoods<T>(
    moodIds: string[],
    keyFor: (moodId: string) => string,
    lang: string,
  ): T[] {
    return moodIds.flatMap((m) => this.getI18nArray<T>(keyFor(m), lang));
  }

  // ─── resolution helpers ───────────────────────────────────────────────────────

  private resolveMoodIds(mood?: string): string[] {
    const all = MOODS.filter((m) => m.id !== 'all').map((m) => m.id as MoodKey);
    if (mood && mood !== 'all' && all.includes(mood as MoodKey)) {
      return [mood];
    }
    return all;
  }

  private resolveHoliday(holiday?: string): HolidayKey | null {
    const valid = HOLIDAY_META.map((h) => h.id as HolidayKey);
    return holiday && valid.includes(holiday as HolidayKey)
      ? (holiday as HolidayKey)
      : null;
  }

  private resolveTextConfig(
    entry: GreetingMessageEntry,
  ): GreetingTextConfigDto {
    if (entry.textConfig) return entry.textConfig;
    if (entry.textConfigId != null) {
      const config = TEXT_CONFIGS[entry.textConfigId];
      if (config) return config;
    }
    return DEFAULT_TEXT_CONFIG;
  }

  // ─── content builders ─────────────────────────────────────────────────────────

  private toMessageResponse(
    entry: GreetingMessageEntry,
  ): GreetingMessageResponseDto {
    return {
      message: entry.text,
      slogan: pickRandom(entry.slogans),
      textConfig: this.resolveTextConfig(entry),
    };
  }

  private buildGreeting(
    context: GreetingContext,
    lang: string,
    moodIds: string[],
    holiday: HolidayKey | null,
  ): GreetingMessageResponseDto {
    if (holiday) {
      const entries = this.collectFromMoods<GreetingMessageEntry>(
        moodIds,
        (m) => `holidays.${holiday}.${context.timeOfDay}.moods.${m}.messages`,
        lang,
      );
      if (entries.length > 0)
        return this.toMessageResponse(pickRandom(entries));
    }

    const wk = weekKey(context.weekOfYear);

    const weekEntries = this.collectFromMoods<GreetingMessageEntry>(
      moodIds,
      (m) => `weeks.${wk}.${context.timeOfDay}.moods.${m}.messages`,
      lang,
    );

    const occasionEntries = context.occasion
      ? this.collectFromMoods<GreetingMessageEntry>(
          moodIds,
          (m) =>
            `holidays.${context.occasion}.${context.timeOfDay}.moods.${m}.messages`,
          lang,
        )
      : [];

    const pool = [...weekEntries, ...occasionEntries];

    if (pool.length === 0) {
      throw new InternalServerErrorException(
        `No greeting content found for week=${wk}, timeOfDay=${context.timeOfDay}, moods=${moodIds.join(',')}`,
      );
    }

    return this.toMessageResponse(pickRandom(pool));
  }

  private pickImage(
    context: GreetingContext,
    lang: string,
    moodIds: string[],
    holiday: HolidayKey | null,
  ): string {
    if (holiday) {
      const urls = this.collectFromMoods<string>(
        moodIds,
        (m) => `holidays.${holiday}.${context.timeOfDay}.moods.${m}.imageUrls`,
        lang,
      );
      return pickRandom(urls);
    }

    const wk = weekKey(context.weekOfYear);

    const urls = this.collectFromMoods<string>(
      moodIds,
      (m) => `weeks.${wk}.${context.timeOfDay}.moods.${m}.imageUrls`,
      lang,
    );
    return pickRandom(urls);
  }

  // ─── public API ───────────────────────────────────────────────────────────────

  getGreeting(
    lang: string,
    mood?: string,
    holiday?: string,
  ): GreetingResponseDto {
    const context = this.greetingContextService.getContext();
    const moodIds = this.resolveMoodIds(mood);
    const resolvedHoliday = this.resolveHoliday(holiday);

    return {
      ...this.buildGreeting(context, lang, moodIds, resolvedHoliday),
      imageUrl: this.pickImage(context, lang, moodIds, resolvedHoliday),
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
      this.resolveMoodIds(mood),
      this.resolveHoliday(holiday),
    );
  }

  getImage(
    lang: string,
    mood?: string,
    holiday?: string,
  ): GreetingImageResponseDto {
    const context = this.greetingContextService.getContext();
    return {
      imageUrl: this.pickImage(
        context,
        lang,
        this.resolveMoodIds(mood),
        this.resolveHoliday(holiday),
      ),
    };
  }

  getMoods(lang: string): MoodOptionsResponseDto {
    const holidayKeys = this.greetingContextService.getUpcomingOccasions(2);

    const moods = MOODS.map((mood) => ({
      ...mood,
      label: String(this.i18n.t(`moods.${mood.id}`, { lang })),
    }));

    const holidayMoods = HOLIDAY_META.filter(
      (h) =>
        holidayKeys.includes(h.id as HolidayKey) ||
        PERMANENT_HOLIDAY_OPTIONS.includes(h.id),
    ).map((h) => ({
      ...h,
      label: String(this.i18n.t(`holiday_labels.${h.id}`, { lang })),
    }));

    return { moods, holidayMoods };
  }
}
