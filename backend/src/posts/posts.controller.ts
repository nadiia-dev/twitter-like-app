import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':id')
  getOnePost(@Param('id') id: string) {
    return this.postsService.getPost(id);
  }

  @Get('/user/:userId')
  getAll(@Param('userId') userId: string) {
    return this.postsService.getAllPostsByUser(userId);
  }

  @Post()
  createPost(@Body() postRequest: CreatePostDto) {
    return this.postsService.createPost(postRequest);
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() postRequest: UpdatePostDto) {
    return this.postsService.updatePost(id, postRequest);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
