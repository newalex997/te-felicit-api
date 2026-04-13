import { Injectable } from '@nestjs/common';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface GreetingContext {
  timeOfDay: TimeOfDay;
  occasion: string | null;
  timezone: string;
  weekOfYear: number;
}

const DEFAULT_TIMEZONE = 'Europe/Chisinau';

// Fixed holidays: [month, day, occasionKey]
const FIXED_OCCASIONS: [number, number, string][] = [
  [1, 1, 'new_year'],
  [1, 2, 'new_year'],
  [1, 6, 'epiphany'],
  [1, 7, 'christmas_orthodox'],
  [1, 13, 'old_new_year'],
  [1, 14, 'old_new_year'],
  [1, 24, 'union_day'],
  [3, 1, 'martisorul'],
  [3, 8, 'women_day'],
  [5, 1, 'labour_day'],
  [5, 9, 'victory_day'],
  [6, 1, 'childrens_day'],
  [8, 15, 'assumption'],
  [8, 27, 'independence_day'],
  [8, 31, 'limba_noastra'],
  [11, 1, 'all_saints'],
  [11, 30, 'saint_andrew'],
  [12, 1, 'national_day'],
  [12, 6, 'saint_nicholas'],
  [12, 25, 'christmas'],
  [12, 26, 'christmas'],
];

@Injectable()
export class GreetingContextService {
  getContext(timezone?: string): GreetingContext {
    const resolvedTimezone = this.resolveTimezone(timezone);
    const local = this.getLocalDateParts(resolvedTimezone);
    const weekOfYear = this.getWeekOfYear(local.year, local.month, local.day);

    return {
      timeOfDay: this.getTimeOfDay(local.hour),
      occasion: this.detectOccasion(local.year, local.month, local.day),
      timezone: resolvedTimezone,
      weekOfYear,
    };
  }

  private resolveTimezone(timezone?: string): string {
    if (!timezone) return DEFAULT_TIMEZONE;
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
      return timezone;
    } catch {
      return DEFAULT_TIMEZONE;
    }
  }

  private getLocalDateParts(timezone: string): {
    year: number;
    month: number;
    day: number;
    hour: number;
  } {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const get = (type: string): number =>
      parseInt(parts.find((p) => p.type === type)!.value);

    return {
      year: get('year'),
      month: get('month'),
      day: get('day'),
      hour: get('hour') % 24, // guard against '24' returned for midnight
    };
  }

  private getTimeOfDay(hour: number): TimeOfDay {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  private detectOccasion(
    year: number,
    month: number,
    day: number,
  ): string | null {
    const fixed = FIXED_OCCASIONS.find(([m, d]) => m === month && d === day);
    if (fixed) return fixed[2];

    const easter = this.orthodoxEasterGregorian(year);
    const easterDate = new Date(Date.UTC(year, easter.month - 1, easter.day));

    const diffDays = Math.round(
      (Date.UTC(year, month - 1, day) - easterDate.getTime()) / 86400000,
    );

    if (diffDays === -7) return 'palm_sunday';
    if (diffDays === 0 || diffDays === 1) return 'easter';
    if (diffDays === 2) return 'easter_monday';
    if (diffDays === 49) return 'whit_sunday';

    // Wine Day: 2nd Sunday of October
    if (month === 10) {
      const sundayCount = this.nthWeekdayOfMonth(year, 10, 0, 2);
      if (day === sundayCount) return 'wine_day';
    }

    return null;
  }

  private getWeekOfYear(year: number, month: number, day: number): number {
    const date = new Date(Date.UTC(year, month - 1, day));
    const dayOfWeek = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayOfWeek);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(
      ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
  }

  /** Returns the day-of-month for the nth occurrence of a weekday in a month.
   *  weekday: 0=Sunday … 6=Saturday, nth: 1-based */
  private nthWeekdayOfMonth(
    year: number,
    month: number,
    weekday: number,
    nth: number,
  ): number {
    const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    const offset = (weekday - first + 7) % 7;
    return 1 + offset + (nth - 1) * 7;
  }

  /**
   * Calculates Orthodox Easter in the Gregorian calendar using Meeus's Julian
   * algorithm, then converting Julian → Gregorian (+13 days for 1900–2099).
   */
  private orthodoxEasterGregorian(year: number): {
    month: number;
    day: number;
  } {
    const a = year % 4;
    const b = year % 7;
    const c = year % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const julianMonth = Math.floor((d + e + 114) / 31);
    const julianDay = ((d + e + 114) % 31) + 1;

    const julianDate = new Date(year, julianMonth - 1, julianDay);
    const gregorianDate = new Date(
      julianDate.getTime() + 13 * 24 * 60 * 60 * 1000,
    );

    return {
      month: gregorianDate.getMonth() + 1,
      day: gregorianDate.getDate(),
    };
  }
}
