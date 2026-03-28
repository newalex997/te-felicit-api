import { IsOptional, IsString } from 'class-validator';

export class GetGreetingParamsDto {
  @IsOptional()
  @IsString()
  name?: string;
}
