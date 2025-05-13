export interface Post {
  id: string;
  title: string;
  text: string;
  authorId: string;
  imageURL?: string;
  likes: string[];
  likesCount: number;
  dislikes: string[];
  dislikesCount: number;
  commentsCount: number;
  createdAt?: string;
  updatedAt?: string;
}
