import { Module } from '@nestjs/common';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [FirebaseModule, PostsModule],
  controllers: [InteractionsController],
  providers: [InteractionsService],
})
export class InteractionsModule {}
