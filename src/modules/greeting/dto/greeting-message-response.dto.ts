import { ApiProperty } from '@nestjs/swagger';

export class GreetingMessageResponseDto {
  @ApiProperty({ example: 'Îți doresc o zi minunată!' })
  message: string;
}
