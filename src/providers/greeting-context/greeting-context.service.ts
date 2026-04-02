import { Injectable } from '@nestjs/common';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface GreetingContext {
  timeOfDay: TimeOfDay;
  season: Season;
  occasion: string | null;
  occasionName: string | null;
  timezone: string;
}

const DEFAULT_TIMEZONE = 'Europe/Bucharest';

// Romanian name for each occasion key
const OCCASION_NAMES: Record<string, string> = {
  new_year: 'Anul Nou',
  union_day: 'Ziua Unirii Principatelor',
  easter: 'Sfintele Paști',
  labour_day: 'Ziua Muncii',
  childrens_day: 'Ziua Copilului',
  assumption: 'Adormirea Maicii Domnului',
  saint_andrew: 'Sfântul Andrei',
  national_day: 'Ziua Națională',
  saint_nicholas: 'Sfântul Nicolae',
  christmas: 'Crăciunul',
};

// Fixed holidays: [month, day, occasionKey]
const FIXED_OCCASIONS: [number, number, string][] = [
  [1, 1, 'new_year'],
  [1, 2, 'new_year'],
  [1, 24, 'union_day'],
  [5, 1, 'labour_day'],
  [6, 1, 'childrens_day'],
  [8, 15, 'assumption'],
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

    const occasion = this.detectOccasion(local.year, local.month, local.day);

    return {
      timeOfDay: this.getTimeOfDay(local.hour),
      season: this.getSeason(local.month, local.day),
      occasion: occasion ?? null,
      occasionName: occasion ? OCCASION_NAMES[occasion] : null,
      timezone: resolvedTimezone,
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

  private getSeason(month: number, day: number): Season {
    if (
      (month === 3 && day >= 20) ||
      month === 4 ||
      month === 5 ||
      (month === 6 && day < 21)
    )
      return 'spring';
    if (
      (month === 6 && day >= 21) ||
      month === 7 ||
      month === 8 ||
      (month === 9 && day < 23)
    )
      return 'summer';
    if (
      (month === 9 && day >= 23) ||
      month === 10 ||
      month === 11 ||
      (month === 12 && day < 21)
    )
      return 'autumn';
    return 'winter';
  }

  private detectOccasion(
    year: number,
    month: number,
    day: number,
  ): string | null {
    const fixed = FIXED_OCCASIONS.find(([m, d]) => m === month && d === day);
    if (fixed) return fixed[2];

    const easter = this.orthodoxEasterGregorian(year);

    if (
      easter.month === month &&
      (easter.day === day || easter.day + 1 === day)
    ) {
      return 'easter';
    }

    return null;
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
    const julianMonth = Math.floor((d + e + 114) / 31); // 3=March or 4=April
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
