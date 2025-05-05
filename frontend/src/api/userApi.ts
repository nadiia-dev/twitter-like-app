import { instance } from "./apiInstance";
import {
  deleteUser,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, fireDb, provider } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

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
    const res = await signInWithEmailAndPassword(auth, email, password);
    const { user } = res;
    const userDocRef = doc(fireDb, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error("User not found in database");
    }
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
    const userDocRef = doc(fireDb, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error("User not found in database");
    }
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
      console.log("User Deleted.");
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};
