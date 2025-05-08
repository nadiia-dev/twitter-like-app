import { getFeedAPI } from "@/api/postApi";
import PostCard from "@/components/PostCard";
import Spinner from "@/components/Spinner";
import { Post } from "@/types/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

const limit = 2;
interface Cursor {
  lastValue: number | undefined;
  lastCreated: string | undefined;
}

const Feed = () => {
  const {
    data: posts,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => {
      const cursor = pageParam as Cursor;
      return getFeedAPI({
        sortParam: "likesCount",
        limit,
        lastValue: cursor?.lastValue,
        lastCreated: cursor?.lastCreated,
      });
    },
    initialPageParam: { lastValue: 0, lastCreated: "" },
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined;
      const lastPost = lastPage[lastPage.length - 1];
      if (!lastPost) return undefined;

      return {
        lastValue: lastPost.likesCount,
        lastCreated: lastPost.createdAt,
      };
    },
  });

  if (error) return <p>{error.message}</p>;

  return (
    <div className="p-4">
      <h1 className="font-orbitron font-bold text-3xl mb-4">Feed</h1>

      {posts && (
        <InfiniteScroll
          dataLength={posts.pages.flat().length}
          loader={<Spinner />}
          next={fetchNextPage}
          hasMore={hasNextPage}
        >
          {posts.pages.flat().map((post: Post) => (
            <PostCard key={post.id} post={post} context="feed" />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Feed;
