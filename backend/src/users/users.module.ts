import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './user.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
