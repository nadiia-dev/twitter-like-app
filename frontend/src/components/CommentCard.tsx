import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { formatDate } from "@/lib/formatDate";
import { CommentWithAuthor } from "@/types/Post";
import { MessageCircle } from "lucide-react";
import { commentReplies } from "@/lib/CommentReplies";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CommentCard = ({
  comments,
  comment,
  postAuthor,
}: {
  comments: CommentWithAuthor[];
  comment: CommentWithAuthor;
  postAuthor: string;
}) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);

  const replies = commentReplies({
    comments: comments!,
    curCommentId: comment.id!,
  });

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
          <div className="w-full flex gap-4 justify-start items-center text-zinc-400 text-sm">
            <div
              className="flex items-center gap-1"
              onClick={() => setShowComments((prev) => !prev)}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{replies.length || 0}</span>
            </div>
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
            />
          ))}
        </div>
      )}
    </>
  );
};

export default CommentCard;
