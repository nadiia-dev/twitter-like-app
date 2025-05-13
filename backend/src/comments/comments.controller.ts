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
import { Auth } from 'src/guards/auth.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Auth()
  @Post('/post/:postId')
  createComment(
    @Param('postId') postId: string,
    @Body() commentData: CreateCommentDto,
  ) {
    return this.commentsService.createComment(postId, commentData);
  }

  @Auth()
  @Patch(':id')
  updateComment(
    @Param('id') id: string,
    @Body() commentData: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(id, commentData);
  }

  @Auth()
  @Delete('delete')
  deleteComment(
    @Query('postId') postId: string,
    @Query('commentId') commentId: string,
  ) {
    return this.commentsService.deleteComment(postId, commentId);
  }
}
