import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts(
    @Query('sortBy') sortParam: 'likesCount' | 'commentsCount',
    @Query('limit') limitRaw: string,
    @Query('lastValue') lastValueRaw: string,
    @Query('lastCreated') lastCreated: string,
  ) {
    const limit = parseInt(limitRaw, 10) || 10;
    const lastValue = lastValueRaw ? parseInt(lastValueRaw, 10) : undefined;

    return this.postsService.getAllPosts(
      sortParam,
      limit,
      lastValue,
      lastCreated,
    );
  }

  @Get(':id')
  getOnePost(@Param('id') id: string) {
    return this.postsService.getPost(id);
  }

  @Get('user/:userId')
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
