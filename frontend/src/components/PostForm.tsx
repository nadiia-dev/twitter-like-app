import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { User } from "@/types/User";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPostAPI, updatePostAPI } from "@/api/postApi";
import { Post } from "@/types/Post";
import { useEffect } from "react";

const validationSchema = z.object({
  title: z.string().min(2),
  text: z.string().min(2),
  imageURL: z.string().optional(),
});

const PostForm = ({
  isDrawerOpen,
  setIsDrawerOpen,
  user,
  curPost,
}: {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  curPost?: Post;
}) => {
  const queryClient = useQueryClient();
  const defaultValues = {
    title: curPost?.title ?? "",
    text: curPost?.text ?? "",
    imageURL: curPost?.imageURL ?? "",
  };
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  useEffect(() => {
    if (curPost) {
      form.reset({
        title: curPost.title ?? "",
        text: curPost.text ?? "",
        imageURL: curPost.imageURL ?? "",
      });
    }
  }, [curPost, form]);

  const createMutation = useMutation({
    mutationFn: (newPost: { [k: string]: string }) => createPostAPI(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postsByUser", user.id] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      postData,
    }: {
      id: string;
      postData: { [k: string]: string };
    }) => updatePostAPI({ id, postData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postsByUser", user.id] });
    },
  });

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    const newPost = Object.fromEntries(
      Object.entries({
        title: values.title,
        text: values.text,
        authorId: user.id,
        imageURL: "",
      }).filter(([_, value]) => value !== undefined && value !== "")
    );
    if (!curPost) {
      createMutation.mutate(newPost);
      setIsDrawerOpen(false);
    } else {
      updateMutation.mutate({ id: curPost.id, postData: newPost });
      setIsDrawerOpen(false);
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{user.name}</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <Form {...form}>
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add theme"
                          type="title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What`s on your mind?"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PostForm;
