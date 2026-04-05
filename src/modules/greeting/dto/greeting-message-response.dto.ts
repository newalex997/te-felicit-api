import { PickType } from '@nestjs/swagger';
import { GreetingResponseDto } from './greeting-response.dto';

export class GreetingMessageResponseDto extends PickType(GreetingResponseDto, [
  'message',
  'slogan',
]) {}
