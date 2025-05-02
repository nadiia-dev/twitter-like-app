import { Body, Controller, Param, Post } from '@nestjs/common';
import { InteractionsService } from './interactions.service';

@Controller('posts')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post(':postId/like')
  like(@Param('postId') postId: string, @Body() userId: { userId: string }) {
    return this.interactionsService.like(userId, postId);
  }

  @Post(':postId/dislike')
  dislike(@Param('postId') postId: string, @Body() userId: { userId: string }) {
    return this.interactionsService.dislike(userId, postId);
  }
}
