import { NestFactory } from '@nestjs/core';
import { BgImagesSeedModule } from './bg-images/bg-images.seed.module';
import { BgImagesSeedService } from './bg-images/bg-images.seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(BgImagesSeedModule, {
    logger: ['log', 'error', 'warn'],
  });

  await app.get(BgImagesSeedService).run();

  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
