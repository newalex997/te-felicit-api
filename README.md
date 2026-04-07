# mesajedinsuflet API

Backend service for the 'Mesaje din suflet' greeting card application. Serves daily cards (background image + text) to the mobile app.

Built with [NestJS](https://nestjs.com/).

## Responsibilities

- Serve a card of the day (background image + themed text)
- Generate card variations on request (3–5 per day limit)
- Manage card content: background images tagged by theme, text templates with AI variation
- Enforce content rules (no repeats within configurable window, no same-day duplicates)

## Tech Stack

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| Framework      | NestJS                                             |
| Database       | MySQL                                              |
| Infrastructure | DigitalOcean (hosting, CDN, S3-compatible storage) |

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Run the service

   ```bash
   # development (watch mode)
   npm run start:dev

   # production
   npm run start:prod
   ```

## Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
