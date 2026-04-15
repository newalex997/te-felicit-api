import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { I18nLang } from 'nestjs-i18n';
import { GreetingImageResponseDto } from './dto/greeting-image-response.dto';
import { GreetingMessageResponseDto } from './dto/greeting-message-response.dto';
import { GreetingResponseDto } from './dto/greeting-response.dto';
import { MoodOptionsResponseDto } from './dto/mood-option.dto';
import { GreetingService } from './greeting.service';

@ApiTags('greeting')
@Controller('greeting')
export class GreetingController {
  constructor(private readonly greetingService: GreetingService) {}

  @ApiOkResponse({ type: GreetingResponseDto })
  @Get()
  getGreeting(
    @I18nLang() lang: string,
    @Query('mood') mood?: string,
  ): GreetingResponseDto {
    return this.greetingService.getGreeting(lang, mood);
  }

  @ApiOkResponse({ type: GreetingMessageResponseDto })
  @Get('message')
  getMessage(
    @I18nLang() lang: string,
    @Query('mood') mood?: string,
  ): GreetingMessageResponseDto {
    return this.greetingService.getMessage(lang, mood);
  }

  @ApiOkResponse({ type: GreetingImageResponseDto })
  @Get('image')
  getImage(@I18nLang() lang: string): GreetingImageResponseDto {
    return this.greetingService.getImage(lang);
  }

  @ApiOkResponse({ type: MoodOptionsResponseDto })
  @Get('moods')
  getMoods(@I18nLang() lang: string): MoodOptionsResponseDto {
    return this.greetingService.getMoods(lang);
  }
}
