import { instance } from "./apiInstance";

export const getPostsByUserAPI = async (userId: string) => {
  try {
    const res = await instance.get(`/posts/user/${userId}`);
    return res.data;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};

export const createPostAPI = async (postData: { [k: string]: string }) => {
  try {
    const res = await instance.post("/posts", postData);
    return res.data();
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};

export const updatePostAPI = async ({
  id,
  postData,
}: {
  id: string;
  postData: { [k: string]: string };
}) => {
  try {
    const res = await instance.put(`/posts/${id}`, postData);
    return res.data();
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};
