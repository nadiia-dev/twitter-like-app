import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
}

@Injectable()
export class PostsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async getAllPosts(): Promise<Post[] | undefined> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const postsRef = firestore.collection('posts');
      const snapshot = await postsRef.get();

      if (snapshot.empty) {
        console.log('No posts found.');
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
}
