import { useState, useEffect } from 'react'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from "./Routes/routes";
import { Toaster } from "sonner";
import { Spin } from 'antd';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={routes} />
      <Toaster expand={true} richColors />
    </>
  )
}

export default App