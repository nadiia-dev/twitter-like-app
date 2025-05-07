import { instance } from "./apiInstance";

export const toggleLikeAPI = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  try {
    const res = await instance.post(`/posts/${postId}/like`, { userId });
    return res.data();
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};
