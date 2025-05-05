import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          Email not verified
        </h1>
        <p className="text-gray-700 mb-6">
          Your email address is not verified. Please check your inbox and click
          on the verification link we sent you.
        </p>
        <Button onClick={() => window.location.reload()}>
          I verified my email
        </Button>
      </div>
    </div>
  );
};

export default NotVerified;
