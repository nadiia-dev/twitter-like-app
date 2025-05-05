import { Button } from "@/components/ui/button";
import { Origami } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center p-24">
      <div className="flex gap-4 justify-center items-center">
        <Origami size={40} color="#1245ba" />
        <h1 className="font-bold text-3xl font-orbitron">Twi App</h1>
      </div>
      <div className="flex gap-3 justify-center items-center">
        <Button asChild>
          <Link to="/register">Register</Link>
        </Button>
        <span>or</span>
        <Button asChild variant="outline">
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
