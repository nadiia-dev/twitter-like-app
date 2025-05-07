import { Comment } from "./Comment";

export interface CreatePost {
  title: string;
  text: string;
  imageURL?: string;
  authorId: string;
}

export interface Post {
  id: string;
  title: string;
  text: string;
  imageURL: string;
  authorId: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  commentsCount: number;
  likesCount: number;
  likes: string[];
  dislikesCount: number;
  dislikes: string[];
}

interface UserProfile {
  id: string;
  name: string;
  photoURL?: string;
}

interface PostWithAuthor extends Post {
  author: UserProfile;
}

export interface CommentWithAuthor extends Comment {
  author: UserProfile;
}

export interface PostDetails {
  post: PostWithAuthor;
  comments: CommentWithAuthor[];
}
