import useCheckAuth from "@/hooks/useCheckAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, checkingAuth } = useCheckAuth();
  if (checkingAuth) return null;

  if (!user) return <Navigate to="/login" />;
  if (!user.emailVerified) return <Navigate to="/not-verified" />;

  return <>{children}</>;
};

export default ProtectedRoute;
