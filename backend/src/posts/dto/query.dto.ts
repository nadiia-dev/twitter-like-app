import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsString()
  searchQuery: string;

  @IsString()
  sortBy: string;

  @IsString()
  limit: string;

  @IsString()
  page: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  lastValue?: number;

  @IsOptional()
  @IsString()
  lastCreated: string;
}
