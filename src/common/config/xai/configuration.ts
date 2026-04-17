import { registerAs } from '@nestjs/config';

export default registerAs('xai', () => ({
  apiKey: process.env.XAI_API_KEY,
  imageModel: process.env.XAI_IMAGE_MODEL,
}));
