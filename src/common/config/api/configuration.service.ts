import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  get env(): string {
    return this.configService.get<string>('api.env') as string;
  }

  get port(): number {
    return this.configService.get<number>('api.port') as number;
  }

  get jwtSecret(): string {
    return this.configService.get<string>('api.jwtSecret') as string;
  }

  get corsWhitelist(): RegExp {
    return new RegExp(
      this.configService.get<string>('api.corsWhitelist') as string,
    );
  }

  get jwtSignOptions(): JwtModuleOptions {
    return { secret: this.jwtSecret, signOptions: { expiresIn: '1d' } };
  }
}
