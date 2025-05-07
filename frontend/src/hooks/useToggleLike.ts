import { toggleLikeAPI } from "@/api/interactionsApi";
import { auth } from "@/firebase/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const useToggleLike = ({
  initialState,
  postId,
  likesCount,
}: {
  initialState: boolean;
  postId: string;
  likesCount: number;
}) => {
  const userId = auth.currentUser?.uid;
  const [liked, setLiked] = useState(initialState);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      toggleLikeAPI({ postId, userId }),
    onMutate: () => {
      setLiked((prev) => !prev);
    },
    onError: () => {
      setLiked((prev) => !prev);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["postById", postId] }),
  });

  const toggleLike = () => {
    mutation.mutate({ postId, userId: userId! });
    setLiked((prev) => !prev);
  };

  return { liked, toggleLike, likesCount };
};

export default useToggleLike;
