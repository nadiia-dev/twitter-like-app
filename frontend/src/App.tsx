import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
          path: "/auth",
          element: <Auth />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
