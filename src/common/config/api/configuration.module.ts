import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import apiConfiguration from './configuration';
import { ApiConfigService } from './configuration.service';
import storageConfiguration from '../storage/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required(),
        API_PORT: Joi.number().port().default(3000),
        CORS_WHITELIST: Joi.string().required(),
        STORAGE_ACCESS_KEY: Joi.string().required(),
        STORAGE_SECRET_KEY: Joi.string().required(),
        STORAGE_BUCKET: Joi.string().required(),
        STORAGE_REGION: Joi.string().default('nyc3'),
      }),
      load: [apiConfiguration, storageConfiguration],
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
