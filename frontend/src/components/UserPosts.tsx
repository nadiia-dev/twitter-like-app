import { getPostsByUserAPI } from "@/api/postApi";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@/types/Post";
import { useState } from "react";
import PostForm from "./PostForm";
import Spinner from "./Spinner";
import PostCard from "./PostCard";
import useUser from "@/hooks/useUser";

const UserPosts = ({ userId }: { userId: string }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [curPost, setCurPost] = useState<Post | undefined>();

  const { data: user } = useUser(userId);

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["postsByUser", userId],
    queryFn: () => getPostsByUserAPI(userId!),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="font-bold font-orbitron text-3xl mb-4">Posts</h2>
      <div className="px-2 md:px-8 grid grid-rows-1 gap-5">
        {postsData &&
          postsData.map((post: Post) => (
            <PostCard
              key={post.id}
              post={post}
              setCurPost={setCurPost}
              setIsDrawerOpen={setIsDrawerOpen}
              context="profile"
              userId={userId}
            />
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
