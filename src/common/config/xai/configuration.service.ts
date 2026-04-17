import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class XaiConfigService {
  constructor(private readonly configService: ConfigService) {}

  get apiKey(): string {
    return this.configService.get<string>('xai.apiKey') as string;
  }

  get imageModel(): string {
    return this.configService.get<string>('xai.imageModel') as string;
  }
}
