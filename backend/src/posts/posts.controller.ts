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
import { Auth } from 'src/guards/auth.decorator';
import { QueryDto } from './dto/query.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth()
  @Get()
  getAllPosts(@Query() query: QueryDto) {
    const { sortBy, limit, lastValue, lastCreated } = query;
    return this.postsService.getAllPosts(sortBy, limit, lastValue, lastCreated);
  }

  @Auth()
  @Get(':id')
  getOnePost(@Param('id') id: string) {
    return this.postsService.getPost(id);
  }

  @Auth()
  @Get('user/:userId')
  getAll(@Param('userId') userId: string) {
    return this.postsService.getAllPostsByUser(userId);
  }

  @Auth()
  @Post()
  createPost(@Body() postRequest: CreatePostDto) {
    return this.postsService.createPost(postRequest);
  }

  @Auth()
  @Put(':id')
  updatePost(@Param('id') id: string, @Body() postRequest: UpdatePostDto) {
    return this.postsService.updatePost(id, postRequest);
  }

  @Auth()
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
