import {
  GreetingTextConfigDto,
  TextPosition,
} from './dto/text-block-config.dto';
import { MoodOptionDto } from './dto/mood-option.dto';

export const TEXT_CONFIGS: Record<number, GreetingTextConfigDto> = {
  1: {
    message: {
      color: '#FFFFFF',
      fontSize: 31,
      position: TextPosition.TOP_CENTER,
    },
    slogan: { color: '#FFD700E6', fontSize: 54, position: TextPosition.CENTER },
  },
  2: {
    message: {
      color: '#FFFFFF',
      fontSize: 29,
      position: TextPosition.TOP_CENTER,
    },
    slogan: { color: '#FFD700E6', fontSize: 54, position: TextPosition.CENTER },
  },
  3: {
    message: { color: '#FFFFFF', fontSize: 31, position: TextPosition.CENTER },
    slogan: { color: '#FFD700E6', fontSize: 54, position: TextPosition.CENTER },
  },
  4: {
    message: {
      color: '#FFE8D0',
      fontSize: 31,
      position: TextPosition.TOP_CENTER,
    },
    slogan: { color: '#FFD700E6', fontSize: 54, position: TextPosition.CENTER },
  },
  5: {
    message: {
      color: '#FFE8D0',
      fontSize: 29,
      position: TextPosition.TOP_CENTER,
    },
    slogan: { color: '#FFD700E6', fontSize: 54, position: TextPosition.CENTER },
  },
  6: {
    message: { color: '#FFE8D0', fontSize: 31, position: TextPosition.CENTER },
    slogan: { color: '#FFD700E6', fontSize: 54, position: TextPosition.CENTER },
  },
  7: {
    message: {
      color: '#CCDEFF',
      fontSize: 31,
      position: TextPosition.TOP_CENTER,
    },
    slogan: { color: '#FFD700E6', fontSize: 54, position: TextPosition.CENTER },
  },
  8: {
    message: {
      color: '#CCDEFF',
      fontSize: 29,
      position: TextPosition.TOP_CENTER,
    },
    slogan: { color: '#FFD700E6', fontSize: 54, position: TextPosition.CENTER },
  },
  9: {
    message: { color: '#CCDEFF', fontSize: 31, position: TextPosition.CENTER },
    slogan: { color: '#FFD700E6', fontSize: 54, position: TextPosition.CENTER },
  },
  10: {
    message: { color: '#FFFFFF', fontSize: 33, position: TextPosition.CENTER },
    slogan: { color: '#FFD700E6', fontSize: 54, position: TextPosition.CENTER },
  },
  11: {
    message: { color: '#FFE8D0', fontSize: 33, position: TextPosition.CENTER },
    slogan: { color: '#FFD700E6', fontSize: 54, position: TextPosition.CENTER },
  },
  12: {
    message: { color: '#CCDEFF', fontSize: 33, position: TextPosition.CENTER },
    slogan: { color: '#FFD700E6', fontSize: 54, position: TextPosition.CENTER },
  },
};

export const MOODS: Omit<MoodOptionDto, 'label'>[] = [
  { id: 'all', emoji: '✨', gradient: ['#667eea', '#764ba2'] },
  { id: 'romantic', emoji: '❤️', gradient: ['#e8175d', '#ff6b6b'] },
  { id: 'joyful', emoji: '😄', gradient: ['#f7971e', '#ffd200'] },
  { id: 'calm', emoji: '🌿', gradient: ['#43b89c', '#2c7873'] },
  { id: 'inspirational', emoji: '🌟', gradient: ['#f093fb', '#f5576c'] },
  { id: 'playful', emoji: '🎉', gradient: ['#fc5c7d', '#6a3093'] },
  { id: 'grateful', emoji: '🙏', gradient: ['#d4a04a', '#7b4f12'] },
  { id: 'warm', emoji: '🌸', gradient: ['#f6d365', '#fda085'] },
  { id: 'bold', emoji: '🔥', gradient: ['#232526', '#e67e22'] },
  { id: 'nostalgic', emoji: '🍂', gradient: ['#8e9eab', '#c8d6df'] },
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
