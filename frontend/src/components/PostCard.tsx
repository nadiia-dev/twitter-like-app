import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  MessageCircle,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User2,
} from "lucide-react";
import { Button } from "./ui/button";
// import { formatDate } from "@/lib/formatDate";
import { Post } from "@/types/Post";
import { auth } from "@/firebase/config";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostAPI } from "@/api/postApi";
import useUser from "@/hooks/useUser";
import Spinner from "./Spinner";

const PostCard = ({
  post,
  setCurPost,
  setIsDrawerOpen,
  context,
  userId,
}: {
  post: Post;
  setCurPost?: React.Dispatch<React.SetStateAction<Post | undefined>>;
  setIsDrawerOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  context: string;
  userId?: string;
}) => {
  const curUser = auth.currentUser;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useUser(
    userId !== undefined ? userId : post.authorId
  );

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePostAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postsByUser", user.id] });
    },
  });

  const handleDelete = (postId: string) => {
    deleteMutation.mutate(postId);
  };

  const handleViewPost = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  if (isLoading) return <Spinner />;

  return (
    <Card onClick={() => handleViewPost(post.id)}>
      <CardHeader>
        <div className="flex items-start gap-3">
          {user.photoURL ? (
            <Avatar className="w-10 h-10 rounded-full overflow-hidden">
              <AvatarImage
                src={user.photoURL}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </Avatar>
          ) : (
            <User2 />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="font-semibold">{user.name}</CardTitle>
              <CardDescription className="text-zinc-400 text-sm">
                {post.createdAt}
              </CardDescription>
            </div>
          </div>
          {context === "profile" && curUser?.uid === post.authorId && (
            <div className="right-4 top-35">
              <Button
                type="button"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  if (setCurPost) setCurPost(post);
                  if (setIsDrawerOpen) setIsDrawerOpen(true);
                }}
              >
                <Pencil size={16} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(post.id);
                }}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold mb-2 capitalize">{post.title}</h3>
        <p className="mb-2.5">{post.text}</p>
        {post.imageURL && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={post.imageURL}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="w-full flex gap-4 justify-end items-end text-zinc-400 text-sm mt-2">
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentsCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsDown className="w-4 h-4" />
            <span>{post.dislikesCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{post.likesCount || 0}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
