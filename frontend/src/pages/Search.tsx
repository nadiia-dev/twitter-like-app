import { searchAPI } from "@/api/postApi";
import PostCard from "@/components/PostCard";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Post } from "@/types/Post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const validationSchema = z.object({
  query: z.string(),
});

const SearchPage = () => {
  const [submittedQuery, setSubmittedQuery] = useState("");

  const {
    data: postsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["searchPosts", submittedQuery],
    queryFn: () => searchAPI(submittedQuery),
    enabled: false,
  });

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    if (submittedQuery) {
      refetch();
    }
  }, [submittedQuery, refetch]);

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    setSubmittedQuery(values.query);
  };

  if (isLoading) return <Spinner />;
  return (
    <div className="p-4">
      <h1 className="font-bold text-3xl font-orbitron mb-4">Search</h1>
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
      {postsData && postsData.length > 0 && (
        <div className="flex flex-col gap-2">
          {postsData.map((post: Post) => (
            <PostCard key={post.id} post={post} context="feed" />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
