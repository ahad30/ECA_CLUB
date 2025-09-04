import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'sonner'
import { QueryClientProvider } from './provider/QueryClientProvider.jsx'




createRoot(document.getElementById('root')).render(
  <StrictMode>
   <QueryClientProvider>
   <AuthProvider>
   <Toaster richColors/>
    <App />
    </AuthProvider>
   </QueryClientProvider>

  </StrictMode>,
)
