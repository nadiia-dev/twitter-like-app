import { HttpException, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Post } from 'src/types';

@Injectable()
export class InteractionsService {
  constructor(private readonly firebaseService: FirebaseService) {}
  async like({ userId }: { userId: string }, postId: string) {
    const firestore = this.firebaseService.getFirestore();
    const postsRef = firestore.collection('posts');
    try {
      const curPost = await postsRef.doc(postId).get();
      if (!curPost.exists) {
        throw new HttpException('Post not found.', 404);
      }
      const post = {
        id: curPost.id,
        ...curPost.data(),
      } as Post;

      let newLikes: string[] = [];
      let count = post.likesCount;
      if (post.likes.includes(userId)) {
        newLikes = post.likes.filter((like) => like !== userId);
        count -= 1;
      } else {
        newLikes = [...post.likes, userId];
        count += 1;
      }

      await postsRef.doc(postId).update({
        likes: newLikes,
        likesCount: count,
      });
      return { message: 'Like' };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching posts: ', error.message);
        throw new Error(error.message);
      }
    }
  }

  async dislike({ userId }: { userId: string }, postId: string) {
    const firestore = this.firebaseService.getFirestore();
    const postsRef = firestore.collection('posts');
    try {
      const curPost = await postsRef.doc(postId).get();
      if (!curPost.exists) {
        throw new HttpException('Post not found.', 404);
      }
      const post = {
        id: curPost.id,
        ...curPost.data(),
      } as Post;

      let newDislikes: string[] = [];
      let count = post.dislikesCount;
      if (post.dislikes.includes(userId)) {
        newDislikes = post.dislikes.filter((dislike) => dislike !== userId);
        count -= 1;
      } else {
        newDislikes = [...post.dislikes, userId];
        count += 1;
      }

      await postsRef.doc(postId).update({
        dislikes: newDislikes,
        dislikesCount: count,
      });

      return { message: 'Dislike' };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching posts: ', error.message);
        throw new Error(error.message);
      }
    }
  }
}
