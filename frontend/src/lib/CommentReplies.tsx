import { CommentWithAuthor } from "@/types/Post";

export function commentReplies({
  comments,
  curCommentId,
}: {
  comments: CommentWithAuthor[];
  curCommentId: string;
}) {
  const commentReplies = comments.filter(
    (comment) => comment.parentCommentId === curCommentId
  );
  return commentReplies;
}
