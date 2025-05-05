// import { useEffect } from "react";
// import { loginUser } from "./api/authApi";
import { Button } from "./components/ui/button";
// import { registerUser } from "./api/authApi";

function App() {
  // useEffect(() => {
  //   async function func() {
  //     try {
  //       const user = await loginUser({
  //         email: "n.pavljuchenko@gmail.com",
  //         password: "qwerty",
  //       });
  //       console.log("User login:", user);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   func();
  // }, []);
  return (
    <div className="text-red-50">
      <Button>Click me</Button>
    </div>
  );
}

export default App;
