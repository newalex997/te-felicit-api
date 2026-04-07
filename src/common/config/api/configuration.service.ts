import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  get env(): string {
    return this.configService.get<string>('api.env') as string;
  }

  get port(): number {
    return this.configService.get<number>('api.port') as number;
  }

  get corsWhitelist(): RegExp {
    return new RegExp(
      this.configService.get<string>('api.corsWhitelist') as string,
    );
  }
}
