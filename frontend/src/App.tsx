import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotVerified from "./pages/NotVerified";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      id: "root",
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/not-verified",
          element: <NotVerified />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
