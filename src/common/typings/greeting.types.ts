export type MoodKey =
  | 'all'
  | 'romantic'
  | 'joyful'
  | 'calm'
  | 'inspirational'
  | 'playful'
  | 'grateful'
  | 'warm'
  | 'bold'
  | 'nostalgic';

export type HolidayKey =
  | 'new_year'
  | 'epiphany'
  | 'christmas_orthodox'
  | 'old_new_year'
  | 'union_day'
  | 'martisorul'
  | 'women_day'
  | 'labour_day'
  | 'victory_day'
  | 'childrens_day'
  | 'assumption'
  | 'independence_day'
  | 'limba_noastra'
  | 'all_saints'
  | 'saint_andrew'
  | 'national_day'
  | 'saint_nicholas'
  | 'christmas'
  | 'palm_sunday'
  | 'easter'
  | 'easter_monday'
  | 'whit_sunday'
  | 'wine_day';

export type OcasionKey = 'birthday' | 'for_loved_one' | 'missing_you';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

/** References an entry in greeting_text_configs.json */
export type TextConfigId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
