export interface CommentData {
  authorId: string;
  text: string;
  parentCommentId?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  text: string;
  parentCommentId?: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
}
