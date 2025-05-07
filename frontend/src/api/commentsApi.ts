import { CommentData } from "@/types/Comment";
import { instance } from "./apiInstance";

export const createCommentAPI = async ({
  postId,
  commentData,
}: {
  postId: string;
  commentData: CommentData;
}) => {
  try {
    const res = await instance.post(`/comments/post/${postId}`, commentData);
    return res.data();
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};
