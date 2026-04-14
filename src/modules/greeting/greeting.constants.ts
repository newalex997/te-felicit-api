import {
  GreetingTextConfigDto,
  TextPosition,
} from './dto/text-block-config.dto';
import { MoodOptionDto } from './dto/mood-option.dto';

export const MOODS: MoodOptionDto[] = [
  { id: 'all', label: 'All', emoji: '✨', gradient: ['#667eea', '#764ba2'] },
  {
    id: 'romantic',
    label: 'Romantic',
    emoji: '❤️',
    gradient: ['#e8175d', '#ff6b6b'],
  },
  {
    id: 'joyful',
    label: 'Joyful',
    emoji: '😄',
    gradient: ['#f7971e', '#ffd200'],
  },
  { id: 'calm', label: 'Calm', emoji: '🌿', gradient: ['#43b89c', '#2c7873'] },
  {
    id: 'inspirational',
    label: 'Inspiring',
    emoji: '🌟',
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    id: 'playful',
    label: 'Playful',
    emoji: '🎉',
    gradient: ['#fc5c7d', '#6a3093'],
  },
  {
    id: 'grateful',
    label: 'Grateful',
    emoji: '🙏',
    gradient: ['#d4a04a', '#7b4f12'],
  },
  { id: 'warm', label: 'Warm', emoji: '🌸', gradient: ['#f6d365', '#fda085'] },
  { id: 'bold', label: 'Bold', emoji: '🔥', gradient: ['#232526', '#e67e22'] },
  {
    id: 'nostalgic',
    label: 'Nostalgic',
    emoji: '🍂',
    gradient: ['#8e9eab', '#c8d6df'],
  },
];

export const DEFAULT_TEXT_CONFIG: GreetingTextConfigDto = {
  message: {
    fontSize: 24,
    color: '#FFFFFF',
    position: TextPosition.CENTER,
  },
  slogan: {
    fontSize: 48,
    color: '#FFFFFFCC',
    position: TextPosition.BOTTOM_CENTER,
  },
};
