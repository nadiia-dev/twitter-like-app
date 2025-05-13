import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @IsString()
  sortBy: string;

  @IsString()
  limit: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  lastValue?: number;

  @IsOptional()
  @IsString()
  lastCreated: string;
}
