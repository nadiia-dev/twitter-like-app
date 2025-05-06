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
  dislikesCount: number;
}
