// Assigns contextual textConfig to each message based on slogan category,
// time of day, and message length. Uses exact slogan phrase matching to avoid
// false positives (e.g. "vară" inside "primăvară").
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = resolve(__dirname, '../src/i18n/ro/greeting.json');

const data = JSON.parse(readFileSync(filePath, 'utf8'));

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

// Message position must not overlap with slogan position
function messagePosition(sloganPosition) {
  if (sloganPosition === 'center') return 'top-center';
  if (sloganPosition === 'top-center') return 'bottom-center';
  return 'center'; // slogan is bottom-center → message goes center
}

// Font size scaled by message text length
function messageFontSize(text, timeOfDay) {
  const bases = { morning: 22, afternoon: 24, evening: 22, night: 20 };
  const base = bases[timeOfDay] ?? 22;
  if (text.length < 70) return base + 4;
  if (text.length > 110) return base - 2;
  return base;
}

// ── Transform ──────────────────────────────────────────────────────────────

function buildTextConfig(entry, timeOfDay) {
  const category = detectSloganCategory(entry.slogans);
  const sloganCfg = SLOGAN_CONFIGS[category];

  return {
    message: {
      fontSize: messageFontSize(entry.text, timeOfDay),
      color: MESSAGE_COLOR[timeOfDay] ?? '#FFFFFF',
      position: messagePosition(sloganCfg.position),
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

const updated = {
  weeks: processSection(data.weeks),
  holidays: processSection(data.holidays),
};

writeFileSync(filePath, JSON.stringify(updated, null, 2));

// ── Verification summary ───────────────────────────────────────────────────
const cats = {};
for (const section of [updated.weeks, updated.holidays]) {
  for (const period of Object.values(section)) {
    for (const [time, block] of Object.entries(period)) {
      for (const msg of block.messages) {
        const cat = detectSloganCategory(msg.slogans);
        cats[cat] = (cats[cat] ?? 0) + 1;
      }
    }
  }
}
console.log('Done. Category breakdown:', cats);
