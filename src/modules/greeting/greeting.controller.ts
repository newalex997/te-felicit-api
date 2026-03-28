import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from '../../common/decorators/skip-auth.decorator';
import { GetGreetingParamsDto } from './dto/get-greeting-params.dto';
import { GreetingService } from './greeting.service';

@ApiTags('greeting')
@Controller('greeting')
export class GreetingController {
  constructor(private readonly greetingService: GreetingService) {}

  @SkipAuth()
  @ApiOkResponse({ schema: { example: { message: 'Hello, World!' } } })
  @Get()
  getGreeting(@Query() params: GetGreetingParamsDto) {
    return this.greetingService.getGreeting(params);
  }
}
