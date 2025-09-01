import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import MainLayout from "../Layout/MainLayout";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import Home from "../Pages/Home/Home";
import ProtectedRoute from "./ProtectedRoute";
import { routesGenerator } from "../utils/routesGenerator";
import { adminRoutes } from "./Admin.Routes";
import DashboardLayout from "../Layout/Dashboard/DashboardLayout";


export const routes = createBrowserRouter([
     
     {
      path: "/",
      element: <MainLayout/>,
      errorElement: <ErrorPage/>,
      children:[
         {
        path: "/",
        element: <ProtectedRoute><Home /></ProtectedRoute>,
        },
         {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      ]
     },

       {
    path: "/admin",
    element: (
     <ProtectedRoute>
        <DashboardLayout />
     </ProtectedRoute>
 
    ),
    errorElement: <ErrorPage/>,
    children: routesGenerator(adminRoutes),
  },
      
]);
