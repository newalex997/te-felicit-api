import { ApiProperty } from '@nestjs/swagger';

export class GreetingImageResponseDto {
  @ApiProperty({ example: 'https://picsum.photos/seed/coffee/800/1200' })
  imageUrl: string;
}
