import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccountObj from '../../serviceAccountKey.json';

@Injectable()
export class FirebaseService {
  private fireApp: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(
        JSON.stringify(serviceAccountObj),
      ) as admin.ServiceAccount;
      this.fireApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
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
