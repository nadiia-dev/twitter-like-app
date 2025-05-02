import { IsOptional, IsString, IsUrl } from 'class-validator';

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
}
