import { deletePostAPI, getPostsByUserAPI } from "@/api/postApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Post } from "@/types/Post";
import { Timestamp } from "firebase/firestore";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "@/types/User";
import {
  MessageCircle,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { auth } from "@/firebase/config";
import { Button } from "./ui/button";
import { useState } from "react";
import PostForm from "./PostForm";

const formatDate = (rawDate: {
  _seconds: number;
  _nanoseconds: number;
}): string => {
  const timestamp = new Timestamp(rawDate._seconds, rawDate._nanoseconds);
  const dateString = timestamp.toDate().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return dateString;
};

const UserPosts = ({ userId, user }: { userId: string; user: User }) => {
  const curUser = auth.currentUser;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [curPost, setCurPost] = useState<Post | undefined>();
  const queryClient = useQueryClient();

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["postsByUser", userId],
    queryFn: () => getPostsByUserAPI(userId!),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePostAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postsByUser", user.id] });
    },
  });

  const handleDelete = (postId: string) => {
    deleteMutation.mutate(postId);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="font-bold font-orbitron text-3xl mb-4">Posts</h2>
      <div className="px-8 grid grid-rows-1 gap-5">
        {postsData &&
          postsData.map((post: Post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                    <AvatarImage
                      src={user.photoURL}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="font-semibold">
                        {user.name}
                      </CardTitle>
                      <CardDescription className="text-zinc-400 text-sm">
                        {formatDate(post.createdAt)}
                      </CardDescription>
                    </div>
                  </div>
                  {curUser?.uid === post.authorId && (
                    <div className="right-4 top-35">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setCurPost(post);
                          setIsDrawerOpen(true);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold mb-2 capitalize">{post.title}</h3>
                <p>{post.text}</p>
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
          ))}
      </div>
      <PostForm
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        user={user}
        curPost={curPost}
      />
    </div>
  );
};

export default UserPosts;
