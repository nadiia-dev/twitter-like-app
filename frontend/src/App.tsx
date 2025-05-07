import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotVerified from "./pages/NotVerified";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Error from "./pages/Error";
import RootLayout from "./components/RootLayout";
import { lazy } from "react";

const queryClient = new QueryClient();

const Feed = lazy(() => import("./pages/Feed.tsx"));
const SettingsPage = lazy(() => import("./pages/Settings.tsx"));
const UserAccountPage = lazy(() => import("./pages/UserAccountPage.tsx"));
const Post = lazy(() => import("./pages/Post.tsx"));

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
