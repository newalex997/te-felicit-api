// Assigns contextual textConfig to each message based on slogan category,
// time of day, and message length. Uses exact slogan phrase matching to avoid
// false positives (e.g. "vară" inside "primăvară").
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const greetingPath = resolve(__dirname, '../src/i18n/ro/greeting.json');
const holidaysPath = resolve(__dirname, '../src/i18n/ro/holidays.json');

const data = JSON.parse(readFileSync(greetingPath, 'utf8'));
const holidaysData = JSON.parse(readFileSync(holidaysPath, 'utf8'));

// ── Slogan category detection ──────────────────────────────────────────────
// Order matters: more specific categories are checked first.

const CATEGORY_PATTERNS = [
  // Patriotic (specific enough to check before generic celebration)
  {
    category: 'patriotic',
    pattern: /trăiască|ziua unirii|1 decembrie fericit/,
  },
  // Celebration / holidays
  {
    category: 'celebration',
    pattern:
      /mulți ani|hristos a înviat|sărbători fericite|colinde și bucurie|an nou fericit|an nou cu bine|crăciun fericit|crăciun binecuvântat|paște fericit|paște binecuvântat|paște cu pace|lumină și înviere|1 mai fericit|1 iunie fericit|ziua copilului fericit|la mulți ani de/,
  },
  // Religious (non-festive)
  {
    category: 'religious',
    pattern:
      /sfântul |sfântă |advent cu|florii binecuvântate|sfântă sărbătoare/,
  },
  // Seasonal — spring
  {
    category: 'spring',
    pattern:
      /primăvara a sosit|primăvara bate|primăvara e a noastră|mărțișor|dragobete|muguri și speranță|flori de mărțișor|dragoste și primăvară|bună dimineața de primăvară/,
  },
  // Seasonal — summer (exact summer slogans only, not substrings of primăvară)
  {
    category: 'summer',
    pattern:
      /vara a sosit|vară cu bucurie|vară cu har|zi minunată de mai|sânziene cu noroc|soare și belșug|bună ziua de vară|bună seara de vară/,
  },
  // Seasonal — autumn
  {
    category: 'autumn',
    pattern:
      /toamna a sosit|toamnă bogată|toamnă cu pace|recoltă bogată|via se coace|vin nou și sănătate|belșug și recoltă|frunze aurii|bună ziua de toamnă|bună seara de toamnă|zi cu spor/,
  },
  // Seasonal — winter (excluding spring/summer overlap)
  {
    category: 'winter',
    pattern:
      /iarnă grea|ger afară|bună dimineața de iarnă|bună seara, cu lumânări/,
  },
  // Time of day
  { category: 'night', pattern: /noapte bună/ },
  { category: 'evening', pattern: /bună seara/ },
  { category: 'afternoon', pattern: /bună ziua/ },
  { category: 'morning', pattern: /bună dimineața/ },
];

function detectSloganCategory(slogans) {
  const joined = slogans.join(' ').toLowerCase();
  for (const { category, pattern } of CATEGORY_PATTERNS) {
    if (pattern.test(joined)) return category;
  }
  return 'default';
}

// ── TextConfig templates ───────────────────────────────────────────────────

const SLOGAN_CONFIGS = {
  celebration: { fontSize: 54, color: '#FFD700E6', position: 'center' },
  patriotic: { fontSize: 50, color: '#FFFFFFE6', position: 'center' },
  religious: { fontSize: 44, color: '#FFE9B0CC', position: 'bottom-center' },
  spring: { fontSize: 46, color: '#FFB3C6CC', position: 'bottom-center' },
  summer: { fontSize: 46, color: '#FFE566CC', position: 'bottom-center' },
  autumn: { fontSize: 44, color: '#FF9A44CC', position: 'bottom-center' },
  winter: { fontSize: 44, color: '#B3D4FFCC', position: 'bottom-center' },
  morning: { fontSize: 46, color: '#FFE58FCC', position: 'bottom-center' },
  afternoon: { fontSize: 46, color: '#FFFFFFCC', position: 'bottom-center' },
  evening: { fontSize: 44, color: '#FFD090CC', position: 'bottom-center' },
  night: { fontSize: 40, color: '#90AAFFCC', position: 'top-center' },
  default: { fontSize: 46, color: '#FFFFFFCC', position: 'bottom-center' },
};

// Message text color by time of day
const MESSAGE_COLOR = {
  morning: '#FFFFFF',
  afternoon: '#FFFFFF',
  evening: '#FFE8D0',
  night: '#CCDEFF',
};

// Font size scaled relative to slogan size and message text length
function messageFontSize(text, sloganFontSize) {
  const base = Math.round(sloganFontSize * 0.58);
  if (text.length < 70) return base + 2;
  if (text.length > 110) return base - 2;
  return base;
}

// ── Transform ──────────────────────────────────────────────────────────────

function buildTextConfig(entry, timeOfDay) {
  const category = detectSloganCategory(entry.slogans);
  const sloganCfg = SLOGAN_CONFIGS[category];

  return {
    message: {
      fontSize: messageFontSize(entry.text, sloganCfg.fontSize),
      color: MESSAGE_COLOR[timeOfDay] ?? '#FFFFFF',
      position: entry.text.length >= 70 ? 'top-center' : 'center',
    },
    slogan: {
      fontSize: sloganCfg.fontSize,
      color: sloganCfg.color,
      position: sloganCfg.position,
    },
  };
}

function processTimeBlock(block, timeOfDay) {
  return {
    messages: block.messages.map((entry) => ({
      ...entry,
      textConfig: buildTextConfig(entry, timeOfDay),
    })),
  };
}

function processSection(section) {
  const result = {};
  for (const [key, value] of Object.entries(section)) {
    result[key] = {
      morning: processTimeBlock(value.morning, 'morning'),
      afternoon: processTimeBlock(value.afternoon, 'afternoon'),
      evening: processTimeBlock(value.evening, 'evening'),
      night: processTimeBlock(value.night, 'night'),
    };
  }
  return result;
}

const updatedWeeks = { weeks: processSection(data.weeks) };
const updatedHolidays = processSection(holidaysData);

writeFileSync(greetingPath, JSON.stringify(updatedWeeks, null, 2));
writeFileSync(holidaysPath, JSON.stringify(updatedHolidays, null, 2));

// ── Verification summary ───────────────────────────────────────────────────
const cats = {};
for (const section of [updatedWeeks.weeks, updatedHolidays]) {
  for (const period of Object.values(section)) {
    for (const block of Object.values(period)) {
      for (const msg of block.messages) {
        const cat = detectSloganCategory(msg.slogans);
        cats[cat] = (cats[cat] ?? 0) + 1;
      }
    }
  }
}
console.log('Done. Category breakdown:', cats);
