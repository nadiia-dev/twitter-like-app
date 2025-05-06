import {
  deleteUserAPI,
  loginUserAPI,
  loginWithGoogleAPI,
  logoutAPI,
  registerUserAPI,
  updateUserProfileAPI,
} from "@/api/userApi";
import { auth } from "@/firebase/config";
// import { UserProfile } from "@/types/User";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, use, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  //   userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  register: (userData: {
    name: string;
    email: string;
    password: string;
  }) => Promise<User | undefined>;
  login: (userData: {
    email: string;
    password: string;
  }) => Promise<User | undefined>;
  loginWithGoogle: () => Promise<User | undefined>;
  logoutUser: () => Promise<void>;
  deleteProfile: () => Promise<void>;
  updateUserProfile: (
    id: string,
    userData: {
      name: string;
      email: string;
      newPassword: string;
      photoURL: string;
    }
  ) => Promise<User | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  //   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const user = await registerUserAPI(userData);

      if (user) {
        setUser(user);
        return user;
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: { email: string; password: string }) => {
    setLoading(true);
    try {
      const user = await loginUserAPI(userData);
      if (user) {
        setUser(user);
        return user;
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const user = await loginWithGoogleAPI();
      if (user) {
        setUser(user);
        return user;
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      const res = await logoutAPI();
      if (res) {
        setUser(null);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async () => {
    setLoading(true);
    try {
      const res = await deleteUserAPI();
      if (res) {
        setUser(null);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (
    id: string,
    userData: {
      name: string;
      email: string;
      newPassword: string;
      photoURL: string;
    }
  ) => {
    setLoading(true);
    try {
      const user = await updateUserProfileAPI(id, userData);
      if (user) {
        setUser(user);
        return user;
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext
      value={{
        user,
        loading,
        error,
        // userProfile,
        register,
        login,
        loginWithGoogle,
        logoutUser,
        deleteProfile,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = (): AuthContextType => {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
