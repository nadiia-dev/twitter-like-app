import { getPostsByUserAPI } from "@/api/postApi";
import { useQuery } from "@tanstack/react-query";
import { Card } from "./ui/card";
import { Post } from "@/types/Post";

const UserPosts = ({ userId }: { userId: string }) => {
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["postsByUser", userId],
    queryFn: () => getPostsByUserAPI(userId!),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="font-bold font-orbitron text-3xl mb-4">Posts</h2>
      <div className="px-8 grid grid-rows-1 gap-5">
        {postsData &&
          postsData.map((post: Post) => <Card key={post.id}></Card>)}
      </div>
    </div>
  );
};

export default UserPosts;
