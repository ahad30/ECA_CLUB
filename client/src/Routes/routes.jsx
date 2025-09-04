import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Spin } from "antd";
import ProtectedRoute from "./ProtectedRoute";
import { routesGenerator } from "../utils/routesGenerator";
import { adminRoutes } from "./Admin.Routes";


const MainLayout = lazy(() => import("../Layout/MainLayout"));
const DashboardLayout = lazy(() => import("../Layout/Dashboard/DashboardLayout"));
const Home = lazy(() => import("../Pages/Home/Home"));
const Login = lazy(() => import("../Pages/Login/Login"));
const Register = lazy(() => import("../Pages/Register/Register"));
const ErrorPage = lazy(() => import("../components/ErrorPage/ErrorPage"));

// ✅ Reusable fallback loader
const LoaderFallback = (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw"
  }}>
    <Spin size="large" />
  </div>
);

// ✅ Suspense wrapper function for each route
const withSuspense = (Component) => (
  <Suspense fallback={LoaderFallback}>
    {Component}
  </Suspense>
);

export const routes = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<MainLayout />),
    errorElement: withSuspense(<ErrorPage />),
    children: [
      {
        path: "/",
        element: withSuspense(
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: withSuspense(<Login />),
      },
      {
        path: "/register",
        element: withSuspense(<Register />),
      },
    ],
  },
  {
    path: "/admin",
    element: withSuspense(
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: withSuspense(<ErrorPage />),
    children: routesGenerator(adminRoutes),
  },
]);
