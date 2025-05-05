import { auth } from "@/firebase/config";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const NotVerified = () => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);
          setIsVerified(true);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isVerified) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      Your email address is not verifed. Check your inbox and verify your
      address.
    </div>
  );
};

export default NotVerified;
