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

export const updateCommentAPI = async ({
  id,
  text,
}: {
  id: string;
  text: string;
}) => {
  try {
    const res = await instance.patch(`/comments/${id}`, { text });
    return res.data();
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};

export const deleteCommentAPI = async ({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) => {
  try {
    const res = await instance.delete(
      `/comments/delete?postId=${postId}&commentId=${commentId}`
    );
    return res.data();
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};
