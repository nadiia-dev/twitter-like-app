import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import * as admin from 'firebase-admin';
import { CreateCommentDto } from './dto/createComment.dto';
import { Post } from 'src/posts/posts.service';
import { UpdateCommentDto } from './dto/updateComment.dto';

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  text: string;
  parentCommentId?: string;
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}

@Injectable()
export class CommentsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createComment(postId: string, commentData: CreateCommentDto) {
    const firestore = this.firebaseService.getFirestore();
    const postRef = firestore.collection('posts').doc(postId);
    const commentsRef = firestore.collection('comments');
    const { text, authorId, parentCommentId } = commentData;

    try {
      const postSnapshot = await postRef.get();
      if (!postSnapshot.exists) {
        throw new Error('Post not found');
      }

      const postData = postSnapshot.data() as Post;

      const newComment = {
        postId,
        authorId,
        text,
        ...(parentCommentId !== undefined && { parentCommentId }),
        createdAt: admin.firestore.Timestamp.now(),
      };

      await firestore.runTransaction(async (transaction) => {
        const postDoc = await transaction.get(postRef);

        if (!postDoc.exists) {
          throw new Error('Post not found');
        }

        const newCommentRef = commentsRef.doc();
        transaction.set(newCommentRef, newComment);

        const currentCommentsCount = postData?.commentsCount || 0;
        transaction.update(postRef, {
          commentsCount: currentCommentsCount + 1,
        });
      });
      return { message: 'Comment added successfully!' };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating new post: ', error.message);
        throw new Error(error.message);
      }
    }
  }

  async updateComment(
    id: string,
    commentData: UpdateCommentDto,
  ): Promise<Comment | undefined> {
    const firestore = this.firebaseService.getFirestore();
    const commentsRef = firestore.collection('comments');
    const { text } = commentData;
    try {
      await commentsRef
        .doc(id)
        .update({ text, updatedAt: admin.firestore.Timestamp.now() });

      const updatedCommentSnap = await commentsRef.doc(id).get();

      if (!updatedCommentSnap) {
        throw new BadRequestException('Can`t update comment');
      }

      return updatedCommentSnap.data() as Comment;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating new comment: ', error.message);
        throw new Error(error.message);
      }
    }
  }

  async deleteComment(postId: string, commentId: string) {
    const firestore = this.firebaseService.getFirestore();
    const postRef = firestore.collection('posts').doc(postId);
    const commentsRef = firestore.collection('comments').doc(commentId);
    try {
      await firestore.runTransaction(async (transaction) => {
        const postDoc = await transaction.get(postRef);

        if (!postDoc.exists) {
          throw new Error('Post not found');
        }

        transaction.delete(commentsRef);

        const postData = postDoc.data() as Post;
        const currentCommentsCount = postData.commentsCount || 0;
        transaction.update(postRef, {
          commentsCount: currentCommentsCount - 1,
        });
      });

      return { message: 'Your comment deleted successfully' };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting comment: ', error.message);
        throw new Error(error.message);
      }
    }
  }
}
