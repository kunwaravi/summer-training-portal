import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Award } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 py-4 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          SummerTraining.io
        </Link>
        
        {user ? (
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-400 transition">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            {user.weekCompleted >= 4 && (
              <Link to="/certificate" className="flex items-center gap-2 hover:text-blue-400 transition text-cyan-400">
                <Award size={18} /> Certificate
              </Link>
            )}
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm">Hello, <span className="text-white font-medium">{user.name}</span></span>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-slate-700 rounded-lg text-red-400 transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-slate-400 text-sm italic">
            Official Summer Training Portal for Electronics Students
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
