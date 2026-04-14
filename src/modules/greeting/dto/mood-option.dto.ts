import { ApiProperty } from '@nestjs/swagger';

export class MoodOptionDto {
  @ApiProperty({ example: 'romantic' })
  id: string;

  @ApiProperty({ example: 'Romantic' })
  label: string;

  @ApiProperty({ example: '❤️' })
  emoji: string;

  @ApiProperty({ example: ['#e8175d', '#ff6b6b'], type: [String] })
  gradient: [string, string];
}

export class MoodOptionsResponseDto {
  @ApiProperty({ type: [MoodOptionDto] })
  moods: MoodOptionDto[];
}
