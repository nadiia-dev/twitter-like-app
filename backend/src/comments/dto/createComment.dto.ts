import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  authorId: string;

  @IsString()
  text: string;

  @IsString()
  @IsOptional()
  parentCommentId: string;
}
