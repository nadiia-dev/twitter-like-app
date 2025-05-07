import { deleteObject, ref } from "firebase/storage";
import { instance } from "./apiInstance";
import { fireDb, storage } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

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

export const deletePostAPI = async (id: string) => {
  try {
    const docRef = doc(fireDb, "posts", id);
    const post = await getDoc(docRef);
    const res = await instance.delete(`/posts/${id}`);
    if (post.exists()) {
      const imageRef = ref(storage, post.data().imageURL);
      await deleteObject(imageRef);
    }
    return res.data();
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};

export const getPostByIdAPI = async (id: string) => {
  try {
    const res = await instance.get(`/posts/${id}`);
    return res.data;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};
