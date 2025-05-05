import { useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "@/redux/user/actions";
import { AppDispatch } from "@/redux/store";

const GoogleAuthButton = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const resultAction = await dispatch(loginWithGoogle());

      if (loginWithGoogle.fulfilled.match(resultAction)) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google auth failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={loading}
      variant="outline"
      className="max-w-sm w-full flex items-center justify-center gap-2"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 533.5 544.3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#4285f4"
          d="M533.5 278.4c0-17.4-1.5-34.1-4.3-50.4H272v95.3h147.1c-6.3 33.7-25 62.2-53.5 81.2v67h86.4c50.6-46.6 81.5-115.4 81.5-193.1z"
        />
        <path
          fill="#34a853"
          d="M272 544.3c72.3 0 132.8-23.9 177-64.9l-86.4-67c-24 16.1-54.6 25.5-90.6 25.5-69.8 0-129-47.1-150.2-110.3H33.5v69.3c44.1 87.5 134.2 147.4 238.5 147.4z"
        />
        <path
          fill="#fbbc04"
          d="M121.8 327.6c-10.5-31.5-10.5-65.6 0-97.1V161.2H33.5c-37.9 75.5-37.9 165.6 0 241.1l88.3-74.7z"
        />
        <path
          fill="#ea4335"
          d="M272 107.7c38.6-.6 75.6 13.6 103.8 39.6l77.6-77.6C407.2 24.6 342.3 0 272 0 167.7 0 77.6 59.9 33.5 147.4l88.3 69.3c21.1-63.2 80.4-109.3 150.2-109z"
        />
      </svg>
      {loading ? "Signing in..." : "Continue with Google"}
    </Button>
  );
};

export default GoogleAuthButton;
