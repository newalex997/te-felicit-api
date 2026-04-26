import { ApiProperty } from '@nestjs/swagger';
import {
  HolidayKey,
  MoodKey,
  OcasionKey,
} from '../../../common/typings/greeting.types';

export class MoodOptionDto {
  @ApiProperty({ example: 'romantic' })
  id: HolidayKey | MoodKey | OcasionKey | 'all';

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

  @ApiProperty({ type: [MoodOptionDto] })
  holidayMoods: MoodOptionDto[];
}
