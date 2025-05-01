import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../serviceAccountKey.json';

@Injectable()
export class FirebaseService {
  private fireApp: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      this.fireApp = admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
    } else {
      this.fireApp = admin.app();
    }
  }

  getFirestore(): admin.firestore.Firestore {
    return this.fireApp.firestore();
  }
}
