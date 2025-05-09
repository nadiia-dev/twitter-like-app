import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { Bucket } from '@google-cloud/storage';

@Injectable()
export class CleanupService {
  private bucket: Bucket;

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {
    this.bucket = this.firebaseService.getStorage().bucket();
  }

  async getAllUsedImages(): Promise<string[]> {
    const usedImages: string[] = [];

    const users = await this.usersService.getUsers();
    if (!users) return usedImages;

    for (const user of users) {
      if (user.photoURL) {
        usedImages.push(user.photoURL);
      }
    }

    const allPostsArrays = await Promise.all(
      users.map((user) => this.postsService.getAllPostsByUser(user.id)),
    );

    for (const posts of allPostsArrays) {
      posts?.forEach((post) => {
        if (post.imageURL) {
          usedImages.push(post.imageURL);
        }
      });
    }

    return usedImages;
  }

  private extractStoragePath(url: string): string {
    const match = decodeURIComponent(url).match(/\/o\/(.+)\?/);
    return match?.[1] ?? url;
  }

  async removeUnusedImages(): Promise<void> {
    const usedImageUrls = await this.getAllUsedImages();
    const usedPaths = usedImageUrls.map((url) => this.extractStoragePath(url));

    const [files] = await this.bucket.getFiles();

    for (const file of files) {
      const fileName = file.name;

      if (!usedPaths.includes(fileName)) {
        console.log(`Deleting unused image: ${fileName}`);
        await file.delete();
      }
    }
  }
}
