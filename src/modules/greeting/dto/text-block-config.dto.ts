import { ApiProperty } from '@nestjs/swagger';

export enum TextPosition {
  TOP_LEFT = 'top-left',
  TOP_CENTER = 'top-center',
  TOP_RIGHT = 'top-right',
  CENTER_LEFT = 'center-left',
  CENTER = 'center',
  CENTER_RIGHT = 'center-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_CENTER = 'bottom-center',
  BOTTOM_RIGHT = 'bottom-right',
}

export class TextBlockConfigDto {
  @ApiProperty({ example: 24, description: 'Font size in sp/pt' })
  fontSize: number;

  @ApiProperty({ example: '#FFFFFF', description: 'Text color as hex or rgba' })
  color: string;

  @ApiProperty({ enum: TextPosition, example: TextPosition.CENTER })
  position: TextPosition;
}

export class GreetingTextConfigDto {
  @ApiProperty({ type: TextBlockConfigDto })
  message: TextBlockConfigDto;

  @ApiProperty({ type: TextBlockConfigDto })
  slogan: TextBlockConfigDto;
}
