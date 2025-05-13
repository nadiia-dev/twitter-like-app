import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateUserDto } from './dto/createUser.dto';
import * as admin from 'firebase-admin';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserProfile } from './user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createUser(
    user: CreateUserDto,
  ): Promise<{ token: string } | undefined> {
    const { name, email, password } = user;
    const service = this.firebaseService.getAdmin();
    const firestore = this.firebaseService.getFirestore();
    const usersRef = firestore.collection('users');

    try {
      const existingUser = await service
        .auth()
        .getUserByEmail(email)
        .catch(() => null);

      if (existingUser) {
        throw new BadRequestException('Email is already registered');
      }
      const createdAuth = await service.auth().createUser({
        displayName: name,
        email,
        password,
      });
      const token = await service.auth().createCustomToken(createdAuth.uid);

      const uid = createdAuth.uid;

      await usersRef.doc(uid).set({
        name,
        email,
        createdAt: admin.firestore.Timestamp.now(),
      });

      return { token };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async updateUser(
    id: string,
    user: UpdateUserDto,
  ): Promise<UserProfile | undefined> {
    const { name, newPassword, photoURL } = user;
    const service = this.firebaseService.getAdmin();
    const firestore = this.firebaseService.getFirestore();
    const usersRef = firestore.collection('users');

    try {
      await service.auth().updateUser(id, {
        displayName: name,
        password: newPassword,
        photoURL,
      });
      await usersRef.doc(id).update({
        ...(name !== undefined && { name }),
        ...(photoURL !== undefined && { photoURL }),
        updatedAt: admin.firestore.Timestamp.now(),
      });
      const updatedUserSnap = await usersRef.doc(id).get();

      if (!updatedUserSnap) {
        throw new BadRequestException('Can`t update user');
      }

      return updatedUserSnap.data() as UserProfile;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async getUserProfileById(id: string): Promise<UserProfile | undefined> {
    const firestore = this.firebaseService.getFirestore();
    const usersRef = firestore.collection('users');
    try {
      const userSnap = await usersRef.doc(id).get();
      if (!userSnap) {
        throw new BadRequestException('Can`t get user by id');
      }
      const userData = userSnap.data() as UserProfile;
      return {
        ...userData,
        id: userSnap.id,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async getUsers(): Promise<UserProfile[] | undefined> {
    const firestore = this.firebaseService.getFirestore();
    const usersRef = firestore.collection('users');
    try {
      const userSnap = await usersRef.get();
      if (!userSnap) {
        throw new BadRequestException('Can`t get user by id');
      }

      const users: UserProfile[] = userSnap.docs.map((doc): UserProfile => {
        const data = doc.data() as Omit<UserProfile, 'id'>;
        return {
          id: doc.id,
          ...data,
        };
      });

      return users;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }
}
