import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, PenSquare, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <PenSquare className="w-6 h-6" />
            SimpleBlog
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/search" className="text-gray-600 hover:text-indigo-600 p-2">
              <Search className="w-5 h-5" />
            </Link>
            
            {user ? (
              <>
                <Link to={`/profile/${user.id}`} className="text-gray-600 hover:text-indigo-600 p-2">
                  <UserIcon className="w-5 h-5" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 p-2"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
