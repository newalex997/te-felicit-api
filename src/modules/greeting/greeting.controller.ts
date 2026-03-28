import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from '../../common/decorators/skip-auth.decorator';
import { GreetingImageResponseDto } from './dto/greeting-image-response.dto';
import { GreetingMessageResponseDto } from './dto/greeting-message-response.dto';
import { GreetingResponseDto } from './dto/greeting-response.dto';
import { GreetingService } from './greeting.service';

@ApiTags('greeting')
@Controller('greeting')
export class GreetingController {
  constructor(private readonly greetingService: GreetingService) {}

  @SkipAuth()
  @ApiOkResponse({ type: GreetingResponseDto })
  @Get()
  getGreeting(): GreetingResponseDto {
    return this.greetingService.getGreeting();
  }

  @SkipAuth()
  @ApiOkResponse({ type: GreetingMessageResponseDto })
  @Get('message')
  getMessage(): GreetingMessageResponseDto {
    return this.greetingService.getMessage();
  }

  @SkipAuth()
  @ApiOkResponse({ type: GreetingImageResponseDto })
  @Get('image')
  getImage(): GreetingImageResponseDto {
    return this.greetingService.getImage();
  }
}
