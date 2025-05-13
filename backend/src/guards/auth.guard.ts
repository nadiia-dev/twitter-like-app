import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const app = this.firebaseService.getAdmin();
    const arg = context.getArgs()[0] as {
      headers?: { authorization?: string };
    };
    const authHeader = arg.headers?.authorization;
    const idToken = authHeader?.split(' ')[1];

    if (!idToken) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const claims = await app.auth().verifyIdToken(idToken);
      const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
      request.user = { uid: claims.uid };
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
