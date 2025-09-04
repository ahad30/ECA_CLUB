import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from "./Routes/routes";
import { Toaster } from "sonner";
import { Spin } from 'antd';

function App() {


  return (
    <>
      <RouterProvider router={routes} />
      <Toaster expand={true} richColors />
    </>
  )
}

export default App