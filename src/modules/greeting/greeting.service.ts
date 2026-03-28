import { Injectable } from '@nestjs/common';
import { GetGreetingParamsDto } from './dto/get-greeting-params.dto';

@Injectable()
export class GreetingService {
  getGreeting(params: GetGreetingParamsDto): { message: string } {
    const target = params.name ?? 'World';
    return { message: `Hello, ${target}!` };
  }
}
