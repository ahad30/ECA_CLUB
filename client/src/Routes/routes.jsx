import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Spin } from "antd";
import ProtectedRoute from "./ProtectedRoute";
import { routesGenerator } from "../utils/routesGenerator";
import { adminRoutes } from "./Admin.Routes";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import MainLayout from "../Layout/MainLayout";
import ErrorPage from "../components/ErrorPage/ErrorPage";


const DashboardLayout = lazy(() => import("../Layout/Dashboard/DashboardLayout"));



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


const withSuspense = (Component) => (
  <Suspense fallback={LoaderFallback}>
    {Component}
  </Suspense>
);

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement:<ErrorPage />,
    children: [
      {
        path: "/",
        element: 
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
 
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
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
    errorElement: <ErrorPage />,
    children: routesGenerator(adminRoutes),
  },
]);
