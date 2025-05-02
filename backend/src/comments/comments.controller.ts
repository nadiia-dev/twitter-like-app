import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Post('/post/:postId')
  createComment(
    @Param('postId') postId: string,
    @Body() commentData: CreateCommentDto,
  ) {
    return this.commentsService.createComment(postId, commentData);
  }

  @Patch(':id')
  updateComment(
    @Param('id') id: string,
    @Body() commentData: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(id, commentData);
  }

  @Delete('delete')
  deleteComment(
    @Query('postId') postId: string,
    @Query('commentId') commentId: string,
  ) {
    return this.commentsService.deleteComment(postId, commentId);
  }
}
