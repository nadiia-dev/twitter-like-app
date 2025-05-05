import { auth } from "@/firebase/config";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = auth.currentUser;

  if (!user) return <Navigate to="/login" />;
  if (!user.emailVerified) return <Navigate to="/not-verified" />;

  return <>{children}</>;
};

export default ProtectedRoute;
