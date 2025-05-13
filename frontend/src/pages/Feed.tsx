import { getFeedAPI } from "@/api/postApi";
import PostCard from "@/components/PostCard";
import Spinner from "@/components/Spinner";
import { Post } from "@/types/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const validationSchema = z.object({
  query: z.string(),
});

const limit = 2;
interface Cursor {
  lastValue: number | undefined;
  lastCreated: string | undefined;
}

const Feed = () => {
  const [submittedQuery, setSubmittedQuery] = useState("");

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    setSubmittedQuery(values.query);
  };

  const {
    data: posts,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts", submittedQuery],
    queryFn: ({ pageParam }) => {
      const { cursor, page } = pageParam as { cursor: Cursor; page: number };
      return getFeedAPI({
        sortParam: "likesCount",
        limit,
        page,
        query: submittedQuery,
        lastValue: cursor?.lastValue,
        lastCreated: cursor?.lastCreated,
      });
    },
    initialPageParam: {
      cursor: { lastValue: 0, lastCreated: "" },
      page: 1,
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      const lastPost = lastPage[lastPage.length - 1];
      if (!lastPost) return undefined;

      return {
        cursor: {
          lastValue: lastPost.likesCount,
          lastCreated: lastPost.createdAt,
        },
        page: allPages.length + 1,
      };
    },
  });

  console.log(posts);

  useEffect(() => {
    if (submittedQuery) {
      refetch();
    }
  }, [submittedQuery, refetch]);

  if (error) return <p>{error.message}</p>;

  return (
    <div className="p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-2 mb-2"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Search"
                    type="query"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button variant="ghost">
            <Search />
          </Button>
        </form>
      </Form>
      <h1 className="font-orbitron font-bold text-3xl mb-4">Feed</h1>
      {posts && (
        <InfiniteScroll
          dataLength={posts.pages.flat().length}
          loader={<Spinner />}
          next={fetchNextPage}
          hasMore={hasNextPage}
          className="flex flex-col gap-2"
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
