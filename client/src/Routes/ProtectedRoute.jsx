import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;