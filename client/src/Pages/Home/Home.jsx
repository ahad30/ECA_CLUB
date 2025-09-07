import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";




const Home = () => {
    const { user } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
       {
        user ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome back, {user?.username}!</h1>
<Link to="/admin/club" className="hover:underline bg-blue-500 text-white font-bold py-2 px-2 rounded-xl">Go to Dashboard</Link>
        </div>

        ) : (
          <div>
            <h1>Welcome to the ECA Club Management System</h1>
            <p>Please log in to access your dashboard.</p>
            <Link to="/login" className="hover:underline">Login</Link>
          </div>
        )
       }
    </div>
  );
};

export default Home;