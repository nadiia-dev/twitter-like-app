import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [FirebaseModule, CommentsModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
