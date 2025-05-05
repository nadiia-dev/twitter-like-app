import { instance } from "./apiInstance";
import {
  sendEmailVerification,
  sendPasswordResetEmail,
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
    await instance.post("/users/signup", userData);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    const user = userCredential.user;

    if (!user.emailVerified) {
      await sendEmailVerification(user);
    }

    return user;
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

export const resetUserPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { message: "Password reset email sent!" };
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};
