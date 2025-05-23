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
import { EllipsisVertical, MessageCircle, User2 } from "lucide-react";
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
import { deleteCommentAPI, updateCommentAPI } from "@/api/commentsApi";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const validationSchema = z.object({
  text: z.string().min(2),
});

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
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useIsMobile();
  const curUser = auth.currentUser;
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      text: comment.text || "",
    },
  });

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

  const updateMutation = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      updateCommentAPI({ id, text }),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["postById", comment.postId] }),
  });

  const handleDelete = () => {
    deleteMutation.mutate({ postId: comment.postId, commentId: comment.id });
  };

  const handleUpdate = (values: z.infer<typeof validationSchema>) => {
    updateMutation.mutate({ id: comment.id, text: values.text });
    setIsEditing(false);
  };

  return (
    <>
      <Card className="mb-1">
        <CardHeader>
          <div className="flex items-start gap-2">
            {comment.author.photoURL ? (
              <Avatar className="w-6 h-6 rounded-full overflow-hidden">
                <AvatarImage
                  src={comment.author.photoURL}
                  alt={comment.author.name}
                  className="w-full h-full object-cover"
                />
              </Avatar>
            ) : (
              <User2 />
            )}
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
          {isEditing ? (
            <Form {...form}>
              <form
                className="flex gap-1"
                onSubmit={form.handleSubmit(handleUpdate)}
              >
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button variant="ghost" className="self-end">
                  Save
                </Button>
              </form>
            </Form>
          ) : (
            <p className="mb-2.5">{comment.text}</p>
          )}
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
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      Edit
                    </DropdownMenuItem>
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
