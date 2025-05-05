import { instance } from "./apiInstance";
import {
  deleteUser,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, provider } from "../firebase/config";

export const registerUserAPI = async (userData: {
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

export const loginUserAPI = async (userData: {
  email: string;
  password: string;
}) => {
  const { email, password } = userData;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    return user;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};

export const loginWithGoogleAPI = async () => {
  try {
    const res = await signInWithPopup(auth, provider);
    const { user } = res;
    return user;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};

export const logoutAPI = async () => {
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

export const deleteUserAPI = async () => {
  const user = auth.currentUser;
  try {
    if (user) {
      await deleteUser(user);
      return { message: "User Deleted." };
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};
