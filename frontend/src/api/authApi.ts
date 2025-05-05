import { instance } from "./apiInstance";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, provider } from "../firebase/config";

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await instance.post("/users/signup", userData);

    return res.data;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};

export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  const { email, password } = userData;
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};

export const loginWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, provider);
    const user = res.user;
    return user;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { message: "Sign-out successful." };
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};
