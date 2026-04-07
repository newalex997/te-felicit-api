import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.API_PORT ?? '3000', 10),
  corsWhitelist: process.env.CORS_WHITELIST,
}));
