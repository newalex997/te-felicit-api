import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { I18nLang } from 'nestjs-i18n';
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
  getGreeting(@I18nLang() lang: string): GreetingResponseDto {
    return this.greetingService.getGreeting(lang);
  }

  @SkipAuth()
  @ApiOkResponse({ type: GreetingMessageResponseDto })
  @Get('message')
  getMessage(@I18nLang() lang: string): GreetingMessageResponseDto {
    return this.greetingService.getMessage(lang);
  }

  @SkipAuth()
  @ApiOkResponse({ type: GreetingImageResponseDto })
  @Get('image')
  getImage(): GreetingImageResponseDto {
    return this.greetingService.getImage();
  }
}
