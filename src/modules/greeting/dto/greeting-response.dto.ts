import { ApiProperty } from '@nestjs/swagger';

export class GreetingResponseDto {
  @ApiProperty({ example: 'Îți doresc o zi minunată!' })
  message: string;

  @ApiProperty({ example: 'https://picsum.photos/seed/coffee/800/1200' })
  imageUrl: string;
}
