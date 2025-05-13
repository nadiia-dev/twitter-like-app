import * as admin from 'firebase-admin';

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  text: string;
  parentCommentId?: string;
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}
