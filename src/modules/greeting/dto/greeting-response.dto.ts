import { ApiProperty } from '@nestjs/swagger';

export class GreetingResponseDto {
  @ApiProperty({ example: 'Astazi este joi' })
  message: string;

  @ApiProperty({ example: 'Bună dimineața!' })
  slogan: string;

  @ApiProperty({ example: 'https://picsum.photos/seed/coffee/800/1200' })
  imageUrl: string;
}
