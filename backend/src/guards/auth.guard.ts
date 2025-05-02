import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly firebaseService: FirebaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const app = this.firebaseService.getAdmin();
    const arg = context.getArgs()[0] as {
      headers?: { authorization?: string };
    };
    const authHeader = arg.headers?.authorization;
    const idToken = authHeader?.split(' ')[1];

    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    try {
      if (idToken) {
        const claims = await app.auth().verifyIdToken(idToken);

        if (claims.role === permissions[0]) {
          return true;
        }
      }
      throw new UnauthorizedException();
    } catch (error) {
      console.log('Error', error);
      throw new UnauthorizedException();
    }
  }
}
