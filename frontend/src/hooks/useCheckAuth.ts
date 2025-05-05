import { auth } from "@/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

const useCheckAuth = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);
  return {
    user,
    checkingAuth,
  };
};

export default useCheckAuth;
