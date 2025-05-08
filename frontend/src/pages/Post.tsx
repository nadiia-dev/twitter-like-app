import { getPostByIdAPI } from "@/api/postApi";
import CommentCard from "@/components/CommentCard";
import CommentForm from "@/components/CommentForm";
import PostCard from "@/components/PostCard";
import Spinner from "@/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Post = () => {
  const params = useParams();
  const postId = params.id!;
  const [curComment, setCurComment] = useState({
    id: "",
    name: "",
  });

  const { data: postData, isLoading } = useQuery({
    queryKey: ["postById", postId],
    queryFn: () => getPostByIdAPI(postId),
  });

  if (isLoading) return <Spinner />;

  return (
    <>
      <div className="p-4">
        <h1 className="font-bold text-3xl font-orbitron mb-4">Thred</h1>
        {postData && (
          <>
            <PostCard post={postData.post} context="postPage" />
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
    </>
  );
};

export default Post;
