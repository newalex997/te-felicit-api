import helmet from 'helmet';
import {
  ConsoleLogger,
  VersioningType,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ApiConfigService } from './common/config/api/configuration.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({ json: true, colors: true }),
    bufferLogs: true,
  });

  const appConfig: ApiConfigService = app.get(ApiConfigService);

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );

  app.enableCors({ origin: appConfig.corsWhitelist, credentials: true });
  app.use(helmet());
  app.useGlobalPipes(
    new I18nValidationPipe({ whitelist: true, transform: true }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  const config = new DocumentBuilder()
    .setTitle('Amaloc Partner CRM API')
    .setDescription('API documentation for Amaloc Partner CRM')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(Number(appConfig.port));
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
