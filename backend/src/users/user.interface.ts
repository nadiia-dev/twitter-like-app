import * as admin from 'firebase-admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}
