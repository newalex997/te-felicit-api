import { Injectable } from '@nestjs/common';

const MOCK_MESSAGES = [
  'Îți doresc o zi minunată, plină de căldură, bucurie și tot ce te face să zâmbești.',
  'La mulți ani! Fie ca fiecare zi să îți aducă liniște, iubire și momente de neuitat.',
  'Gândurile mele bune sunt cu tine. Să ai parte de fericire și sănătate din plin!',
  'Îți trimit cele mai calde urări și sper că ziua ta este la fel de frumoasă ca tine.',
  'Să îți fie viața plină de culoare, râsete și oameni care te prețuiesc cu adevărat.',
  'Cu drag îți urez tot ce e mai bun — sănătate, bucurie și vise împlinite!',
  'Fie ca această zi să fie începutul celor mai frumoase momente din viața ta.',
];

const MOCK_IMAGE_URLS = [
  'https://picsum.photos/seed/coffee/800/1200',
  'https://picsum.photos/seed/cat/800/1200',
  'https://picsum.photos/seed/eagle/800/1200',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

@Injectable()
export class GreetingService {
  getGreeting(): { message: string; imageUrl: string } {
    return {
      message: pickRandom(MOCK_MESSAGES),
      imageUrl: pickRandom(MOCK_IMAGE_URLS),
    };
  }

  getMessage(): { message: string } {
    return { message: pickRandom(MOCK_MESSAGES) };
  }

  getImage(): { imageUrl: string } {
    return { imageUrl: pickRandom(MOCK_IMAGE_URLS) };
  }
}
