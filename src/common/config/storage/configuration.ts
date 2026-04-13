import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  accessKey: process.env.STORAGE_ACCESS_KEY,
  secretKey: process.env.STORAGE_SECRET_KEY,
  bucket: process.env.STORAGE_BUCKET,
  region: process.env.STORAGE_REGION ?? 'nyc3',
}));
