import { getPostByIdAPI } from "@/api/postApi";
import CommentCard from "@/components/CommentCard";
import CommentForm from "@/components/CommentForm";
import RootLayout from "@/components/RootLayout";
import Spinner from "@/components/Spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/firebase/config";
import useToggleDislike from "@/hooks/useToggleDislike";
import useToggleLike from "@/hooks/useToggleLike";
import { formatDate } from "@/lib/formatDate";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Post = () => {
  const navigate = useNavigate();
  const params = useParams();
  const postId = params.id!;
  const curUserId = auth.currentUser!.uid;
  const [curComment, setCurComment] = useState({
    id: "",
    name: "",
  });

  const { data: postData, isLoading } = useQuery({
    queryKey: ["postById", postId],
    queryFn: () => getPostByIdAPI(postId),
  });

  let isLiked = false;
  let isDisliked = false;
  if (postData) {
    isLiked = postData.post.likes.some((like) => like === curUserId);
    isDisliked = postData.post.dislikes.some(
      (dislike) => dislike === curUserId
    );
  }

  const { liked, toggleLike } = useToggleLike({
    initialState: isLiked,
    postId,
  });

  const { disliked, toggleDislike } = useToggleDislike({
    initialState: isDisliked,
    postId,
  });

  if (isLoading) return <Spinner />;

  return (
    <RootLayout>
      <div className="p-4">
        <h1 className="font-bold text-3xl font-orbitron mb-4">Thred</h1>
        {postData && (
          <>
            <Card className="mb-3">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                    <AvatarImage
                      src={postData.post.author.photoURL}
                      alt={postData.post.author.name}
                      className="w-full h-full object-cover"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle
                        className="font-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/account/${postData.post.authorId}`);
                        }}
                      >
                        {postData.post.author.name}
                      </CardTitle>
                      <CardDescription className="text-zinc-400 text-sm">
                        {formatDate(postData.post.createdAt)}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold mb-2 capitalize">
                  {postData.post.title}
                </h3>
                <p className="mb-2.5">{postData.post.text}</p>
                {postData.post.imageURL && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={postData.post.imageURL}
                      alt={postData.post.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full flex gap-4 justify-center items-center text-zinc-400 text-sm mt-2">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{postData.post.commentsCount || 0}</span>
                  </div>
                  <div
                    className={clsx(
                      "flex items-center gap-1",
                      disliked && "text-red-600"
                    )}
                    onClick={toggleDislike}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{postData.post.dislikesCount || 0}</span>
                  </div>
                  <div
                    className={clsx(
                      "flex items-center gap-1",
                      liked && "text-red-600"
                    )}
                    onClick={toggleLike}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{postData.post.likesCount || 0}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <div>
              {postData.comments.length > 0 &&
                postData.comments
                  .filter((comment) => !comment.parentCommentId)
                  .map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comments={postData.comments}
                      comment={comment}
                      postAuthor={postData.post.authorId}
                      setCurComment={setCurComment}
                    />
                  ))}
            </div>
          </>
        )}
      </div>
      <CommentForm postId={postData!.post.id} parentComment={curComment} />
    </RootLayout>
  );
};

export default Post;
