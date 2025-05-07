import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDate } from "@/lib/formatDate";
import { CommentWithAuthor } from "@/types/Post";
import { EllipsisVertical, MessageCircle } from "lucide-react";
import { commentReplies } from "@/lib/CommentReplies";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { auth } from "@/firebase/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentAPI } from "@/api/commentsApi";

const CommentCard = ({
  comments,
  comment,
  postAuthor,
  setCurComment,
}: {
  comments: CommentWithAuthor[];
  comment: CommentWithAuthor;
  postAuthor: string;
  setCurComment: React.Dispatch<
    React.SetStateAction<{ id: string; name: string }>
  >;
}) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const isMobile = useIsMobile();
  const curUser = auth.currentUser;
  const queryClient = useQueryClient();

  const replies = commentReplies({
    comments: comments!,
    curCommentId: comment.id!,
  });

  const deleteMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => deleteCommentAPI({ postId, commentId }),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["postById", comment.postId] }),
  });

  const handleDelete = () => {
    deleteMutation.mutate({ postId: comment.postId, commentId: comment.id });
  };

  return (
    <>
      <Card className="mb-1">
        <CardHeader>
          <div className="flex items-start gap-2">
            <Avatar className="w-6 h-6 rounded-full overflow-hidden">
              <AvatarImage
                src={comment.author.photoURL}
                alt={comment.author.name}
                className="w-full h-full object-cover"
              />
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-center gap-1">
                <div>
                  <CardTitle
                    className="font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/account/${comment.authorId}`);
                    }}
                  >
                    {comment.author.name}
                  </CardTitle>
                  <CardDescription className="text-zinc-400 text-sm">
                    {comment.author.id === postAuthor && "Author"}
                  </CardDescription>
                </div>
                <CardDescription className="text-zinc-400 text-sm">
                  {formatDate(comment.createdAt)}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-2.5">{comment.text}</p>
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-between items-center text-zinc-400 text-sm">
            <div className="flex gap-4">
              <div
                className="flex items-center gap-1"
                onClick={() => setShowComments((prev) => !prev)}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{replies.length || 0}</span>
              </div>
              <div
                onClick={() =>
                  setCurComment({ id: comment.id, name: comment.author.name })
                }
              >
                Reply
              </div>
            </div>
            {comment.author.id === curUser?.uid && (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side={isMobile ? "top" : "right"}
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete}>
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
      {showComments && replies.length > 0 && (
        <div className="replies" style={{ marginLeft: "1rem" }}>
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comments={comments}
              comment={reply}
              postAuthor={postAuthor}
              setCurComment={setCurComment}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default CommentCard;
