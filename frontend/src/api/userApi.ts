import { instance } from "./apiInstance";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth, fireDb, provider } from "../firebase/config";
import { deleteDoc, doc } from "firebase/firestore";

export const registerUserAPI = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await instance.post("/users/signup", userData);

    const token = res.data.token;

    const userCredential = await signInWithCustomToken(auth, token);

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

export const reauthenticateUserAPI = async (user: User, password?: string) => {
  const userProvider = user.providerData[0].providerId;
  try {
    if (userProvider === "google.com") {
      await reauthenticateWithPopup(user, provider);
    } else if (userProvider === "password") {
      if (!password)
        throw new Error("Password is required for reauthentication");

      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
    }
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
      await deleteDoc(doc(fireDb, "users", user.uid));
      await deleteUser(user);
      return { message: "User Deleted." };
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};

export const updateUserProfileAPI = async (userData: {
  [k: string]: string;
}) => {
  try {
    const res = await instance.put(`/users`, userData);
    if (res) {
      return res.data;
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};

export const getUserAPI = async (id?: string) => {
  try {
    const res = await instance.get(`/users/${id}`);
    return res.data;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
};
