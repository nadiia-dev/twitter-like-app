import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreatePostDto } from './dto/createPost.dto';
import * as admin from 'firebase-admin';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Comment } from 'src/comments/comments.service';

interface UserProfile {
  id: string;
  name: string;
  photoURL?: string;
}

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
  createdAt?: string;
  updatedAt?: string;
}

interface PostWithAuthor extends Post {
  author: UserProfile;
}

interface CommentWithAuthor extends Comment {
  author: UserProfile;
}

export interface PostWithCommentsAndAuthors {
  post: PostWithAuthor;
  comments: CommentWithAuthor[];
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
        const data = doc.data() as Omit<Post, 'id'> & {
          createdAt: admin.firestore.Timestamp;
        };
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
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

  async getPost(id: string): Promise<PostWithCommentsAndAuthors | undefined> {
    const firestore = this.firebaseService.getFirestore();
    const postsRef = firestore.collection('posts');
    const usersRef = firestore.collection('users');
    try {
      const postDoc = await postsRef.doc(id).get();

      if (!postDoc.exists) {
        throw new HttpException('Post not found.', 404);
      }

      const postData = {
        id: postDoc.id,
        ...postDoc.data(),
      } as Post;

      const postAuthorDoc = await usersRef.doc(postData.authorId).get();
      const postAuthor = {
        id: postAuthorDoc.id,
        name: postAuthorDoc.data()?.name as string,
        photoURL: postAuthorDoc.data()?.photoURL as string,
      } as UserProfile;

      const commentsSnapshot = await firestore
        .collection('comments')
        .where('postId', '==', id)
        .orderBy('createdAt', 'desc')
        .get();

      const commentsRaw = commentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];

      const commentsAuthorsId = Array.from(
        new Set(commentsRaw.map((c) => c.authorId)),
      );

      const commentsAuthors = await Promise.all(
        commentsAuthorsId.map((authorId) => usersRef.doc(authorId).get()),
      );

      const commentAuthorsMap = new Map<string, UserProfile>();
      commentsAuthors.forEach((doc) => {
        if (doc.exists) {
          commentAuthorsMap.set(doc.id, {
            id: doc.id,
            name: doc.data()?.name as string,
            photoURL: doc.data()?.photoURL as string,
          } as UserProfile);
        }
      });

      const post: PostWithAuthor = {
        ...postData,
        id: postDoc.id,
        author: postAuthor,
      };

      const comments: CommentWithAuthor[] = commentsRaw.map((comment) => ({
        ...comment,
        author: commentAuthorsMap.get(comment.authorId)!,
      }));

      return { post, comments };
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
      const snapshot = await postsRef
        .where('authorId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

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
    const { title, text, authorId, imageURL } = postData;
    try {
      const newPostRef = await postsRef.add({
        title,
        text,
        ...(imageURL !== undefined && { imageURL }),
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
    const { title, text, imageURL } = postData;
    try {
      await postsRef.doc(id).update({
        ...(title !== undefined && { title }),
        ...(text !== undefined && { text }),
        ...(imageURL !== undefined && { imageURL }),
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
