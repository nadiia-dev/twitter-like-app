import { toggleDislikeAPI } from "@/api/interactionsApi";
import { auth } from "@/firebase/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const useToggleDislike = ({
  initialState,
  postId,
}: {
  initialState: boolean;
  postId: string;
}) => {
  const userId = auth.currentUser?.uid;
  const [disliked, setDisliked] = useState(initialState);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      toggleDislikeAPI({ postId, userId }),
    onMutate: () => {
      setDisliked((prev) => !prev);
    },
    onError: () => {
      setDisliked((prev) => !prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["postById", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["postsByUser", userId] });
    },
  });

  const toggleDislike = () => {
    mutation.mutate({ postId, userId: userId! });
    setDisliked((prev) => !prev);
  };

  return { disliked, toggleDislike };
};

export default useToggleDislike;
