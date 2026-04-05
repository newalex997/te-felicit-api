import { Module } from '@nestjs/common';
import * as path from 'path';
import {
  AcceptLanguageResolver,
  I18nModule as i18n,
  HeaderResolver,
  QueryResolver,
} from 'nestjs-i18n';

@Module({
  imports: [
    i18n.forRoot({
      fallbackLanguage: 'ro',
      loaderOptions: {
        path: path.join(__dirname, '../../i18n/'),
        includeSubdirs: true,
        watch: process.env.NODE_ENV !== 'production',
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        new HeaderResolver(['x-lang']),
        AcceptLanguageResolver,
      ],
    }),
  ],
})
export class I18nModule {}
