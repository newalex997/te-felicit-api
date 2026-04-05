import { PickType } from '@nestjs/swagger';
import { GreetingResponseDto } from './greeting-response.dto';

export class GreetingImageResponseDto extends PickType(GreetingResponseDto, [
  'imageUrl',
]) {}
