import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { auth } from "@/firebase/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommentAPI } from "@/api/commentsApi";
import { CommentData } from "@/types/Comment";
import { User2 } from "lucide-react";

const validationSchema = z.object({
  text: z.string().min(2),
});

const CommentForm = ({
  postId,
  parentComment,
}: {
  postId: string;
  parentComment?: { id: string; name: string };
}) => {
  const queryClient = useQueryClient();
  const curUser = auth.currentUser;
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      text: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: ({
      postId,
      commentData,
    }: {
      postId: string;
      commentData: CommentData;
    }) => createCommentAPI({ postId, commentData }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["postById", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const onSubmit = (values: z.infer<typeof validationSchema>) => {
    const commentData = {
      text: values.text || "",
      authorId: curUser!.uid,
      parentCommentId: parentComment?.id || "",
    };
    createMutation.mutate({ postId, commentData });
    form.reset({ text: "" });
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-stone-100 p-2">
      <Form {...form}>
        <form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-2 items-center w-full">
            {curUser?.photoURL ? (
              <Avatar className="w-6 h-6 rounded-full overflow-hidden">
                <AvatarImage
                  src={curUser.photoURL || ""}
                  alt={curUser.displayName || ""}
                  className="w-full h-full object-cover"
                />
              </Avatar>
            ) : (
              <User2 />
            )}
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      className="bg-stone-50 rounded-4xl text-xs w-full"
                      placeholder={
                        parentComment?.name
                          ? `Your reply to ${parentComment?.name}`
                          : "Share your thoughts here..."
                      }
                      type="text"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button variant="ghost" className="self-end">
            Publish
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CommentForm;
