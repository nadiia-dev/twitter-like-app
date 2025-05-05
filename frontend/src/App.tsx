// import { useEffect } from "react";
import { Button } from "./components/ui/button";
// import { resetUserPassword } from "./api/authApi";

function App() {
  // useEffect(() => {
  //   async function func() {
  //     try {
  //       const user = await resetUserPassword("n.pavljuchenko@gmail.com");
  //       console.log(user);
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
