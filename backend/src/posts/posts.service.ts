import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreatePostDto } from './dto/createPost.dto';
import * as admin from 'firebase-admin';
import { UpdatePostDto } from './dto/updatePost.dto';

export interface Post {
  id: string;
  title: string;
  text: string;
  authorId: string;
  imageUrl?: string;
  likes: string[];
  likesCount: number;
  dislikes: string[];
  dislikesCount: number;
  commentsCount: number;
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}

@Injectable()
export class PostsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async getAllPosts(
    sortParam: string,
    limit: number,
    lastValue?: number,
    lastCreated?: string,
  ): Promise<Post[] | undefined> {
    const firestore = this.firebaseService.getFirestore();
    const postsRef = firestore.collection('posts');
    const allowedSortFields = ['likesCount', 'commentsCount'];
    const sortBy = allowedSortFields.includes(sortParam)
      ? sortParam
      : 'likesCount';
    const pageSize = Number(limit) || 10;

    try {
      let postsQuery = postsRef
        .orderBy(sortBy, 'desc')
        .orderBy('createdAt', 'desc');

      if (lastValue && lastCreated) {
        const lastCreatedDate = new Date(lastCreated);
        if (isNaN(lastCreatedDate.getTime())) {
          throw new HttpException('Invalid lastCreated date.', 400);
        }
        postsQuery = postsQuery.startAfter(
          Number(lastValue),
          admin.firestore.Timestamp.fromDate(new Date(lastCreated)),
        );
      }

      postsQuery = postsQuery.limit(pageSize);

      const snapshot = await postsQuery.get();

      if (snapshot.empty) {
        throw new HttpException('No posts found.', 404);
      }
      const posts: Post[] = snapshot.docs.map((doc): Post => {
        const data = doc.data() as Omit<Post, 'id'>;
        return {
          id: doc.id,
          ...data,
        };
      });

      return posts;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching posts: ', error.message);
        throw new Error(error.message);
      }
    }
  }

  async getPost(id: string): Promise<Post | undefined> {
    const firestore = this.firebaseService.getFirestore();
    const postsRef = firestore.collection('posts');
    try {
      const postDoc = await postsRef.doc(id).get();

      if (!postDoc.exists) {
        throw new HttpException('Post not found.', 404);
      }
      const post = {
        id: postDoc.id,
        ...postDoc.data(),
      } as Post;
      return post;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching post: ', error.message);
        throw new Error(error.message);
      }
    }
  }

  async getAllPostsByUser(userId: string): Promise<Post[] | undefined> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const postsRef = firestore.collection('posts');
      const snapshot = await postsRef.where('authorId', '==', userId).get();

      if (snapshot.empty) {
        throw new HttpException('No posts found.', 404);
      }
      const posts: Post[] = snapshot.docs.map((doc): Post => {
        const data = doc.data() as Omit<Post, 'id'>;
        return {
          id: doc.id,
          ...data,
        };
      });

      return posts;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching posts: ', error.message);
        throw new Error(error.message);
      }
    }
  }

  async createPost(postData: CreatePostDto): Promise<Post | undefined> {
    const firestore = this.firebaseService.getFirestore();
    const postsRef = firestore.collection('posts');
    const { title, text, authorId } = postData;
    try {
      const newPostRef = await postsRef.add({
        title,
        text,
        authorId,
        likes: [],
        likesCount: 0,
        dislikes: [],
        dislikesCount: 0,
        commentsCount: 0,
        createdAt: admin.firestore.Timestamp.now(),
      });

      const newPostSnapshot = await newPostRef.get();
      const newPost = {
        id: newPostSnapshot.id,
        ...newPostSnapshot.data(),
      } as Post;

      return newPost;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating new post: ', error.message);
        throw new Error(error.message);
      }
    }
  }

  async updatePost(
    id: string,
    postData: UpdatePostDto,
  ): Promise<Post | undefined> {
    const firestore = this.firebaseService.getFirestore();
    const postsRef = firestore.collection('posts');
    const { title, text, imageUrl } = postData;
    try {
      await postsRef.doc(id).update({
        ...(title !== undefined && { title }),
        ...(text !== undefined && { text }),
        ...(imageUrl !== undefined && { imageUrl }),
        updatedAt: admin.firestore.Timestamp.now(),
      });
      const updatedPostSnap = await postsRef.doc(id).get();

      if (!updatedPostSnap) {
        throw new BadRequestException('Can`t update post');
      }

      return updatedPostSnap.data() as Post;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating post: ', error.message);
        throw new Error(error.message);
      }
    }
  }

  async deletePost(id: string) {
    const firestore = this.firebaseService.getFirestore();
    const postsRef = firestore.collection('posts');
    try {
      await postsRef.doc(id).delete();
      return { message: 'Your post deleted successfully' };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting post: ', error.message);
        throw new Error(error.message);
      }
    }
  }
}
