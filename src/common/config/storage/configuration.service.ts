import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageConfigService {
  constructor(private readonly configService: ConfigService) {}

  get accessKey(): string {
    return this.configService.get<string>('storage.accessKey') as string;
  }

  get secretKey(): string {
    return this.configService.get<string>('storage.secretKey') as string;
  }

  get bucket(): string {
    return this.configService.get<string>('storage.bucket') as string;
  }

  get region(): string {
    return this.configService.get<string>('storage.region') as string;
  }
}
