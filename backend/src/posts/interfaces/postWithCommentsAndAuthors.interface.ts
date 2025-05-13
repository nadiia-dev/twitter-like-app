import { Comment } from '../../comments/comment.interface';
import { Post } from './post.interface';
import { UserProfile } from './userProfile.interface';

export interface PostWithAuthor extends Post {
  author: UserProfile;
}

export interface CommentWithAuthor extends Comment {
  author: UserProfile;
}

export interface PostWithCommentsAndAuthors {
  post: PostWithAuthor;
  comments: CommentWithAuthor[];
}
