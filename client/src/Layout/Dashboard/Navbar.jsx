import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { IoIosArrowDroprightCircle } from 'react-icons/io';

const Navbar = ({
  setIsSidebarOpen,
  isSidebarOpen,
}) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logout Successful");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div>
            {isSidebarOpen === false && (
              <button
                className="lg:hidden"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
              >
                <IoIosArrowDroprightCircle size={25} className="text-white" />
              </button>
            )}

            <p className="text-[#E0E0E0] hidden lg:block">Dashboard</p>
          </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span>Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;