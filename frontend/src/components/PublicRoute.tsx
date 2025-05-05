import useCheckAuth from "@/hooks/useCheckAuth";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, checkingAuth } = useCheckAuth();

  if (checkingAuth) return null;

  if (user) return <Navigate to="/feed" />;

  return <>{children}</>;
};

export default PublicRoute;
