import { Module } from '@nestjs/common';
import { CleanupService } from './cleanup.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [FirebaseModule, PostsModule, UsersModule],
  providers: [CleanupService],
  exports: [CleanupService],
})
export class CleanupModule {}
