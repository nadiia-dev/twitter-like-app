import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotVerified from "./pages/NotVerified";
import Feed from "./pages/Feed";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/authContext";
import SettingsPage from "./pages/Settings";
import UserAccountPage from "./pages/UserAccountPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Post from "./pages/Post";
import Error from "./pages/Error";
import RootLayout from "./components/RootLayout";

const queryClient = new QueryClient();

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      id: "root",
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: (
            <PublicRoute>
              <Home />
            </PublicRoute>
          ),
        },
        {
          path: "/login",
          element: (
            <PublicRoute>
              <Login />
            </PublicRoute>
          ),
        },
        {
          path: "/register",
          element: (
            <PublicRoute>
              <Register />
            </PublicRoute>
          ),
        },
        {
          path: "/not-verified",
          element: <NotVerified />,
        },
        {
          element: (
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/feed",
              element: <Feed />,
            },
            {
              path: "/settings",
              element: <SettingsPage />,
            },
            {
              path: "/account/:id",
              element: <UserAccountPage />,
            },
            {
              path: "/post/:id",
              element: <Post />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
