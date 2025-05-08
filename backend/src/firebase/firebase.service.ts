import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private fireApp: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      const serviceAccount: admin.ServiceAccount = {
        projectId: process.env.PROJECT_ID as string,
        privateKey: process.env.PRIVATE_KEY as string,
        clientEmail: process.env.CLIENT_EMAIL as string,
      };

      this.fireApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `gs://${serviceAccount.projectId}.firebasestorage.app`,
      });
    } else {
      this.fireApp = admin.app();
    }
  }

  getAdmin(): admin.app.App {
    return this.fireApp;
  }

  getFirestore(): admin.firestore.Firestore {
    return this.fireApp.firestore();
  }
}
