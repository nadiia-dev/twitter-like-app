import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreatePostDto {
  @IsString()
  authorId: string;

  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  @IsOptional()
  imageUrl: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  likesCount?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(0)
  dislikesCount?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(0)
  commentsCount?: number = 0;
}
