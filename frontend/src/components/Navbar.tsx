import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('edunexus_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('edunexus_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if user has completed at least one training track
  const hasCompletedAny = user?.progresses?.some((p: any) => p.completed) || false;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 py-4 shadow-lg no-print">
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        {/* Brand logo - NEXUS LABS */}
        {/* Brand logo - EDUNEXUS */}
        <Link 
          to={user ? "/dashboard" : "/"} 
          className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2 tracking-tight hover:scale-[1.01] transition-transform"
        >
          <ShieldCheck className="text-emerald-400 fill-emerald-400/10" size={24} />
          <span>EDUNEXUS</span>
        </Link>
        
        {user ? (
          /* Logged In Options Grid */
          <div className="flex items-center gap-6">
            
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-slate-350 hover:text-white transition text-sm font-semibold tracking-wide"
            >
              <LayoutDashboard size={18} className="text-slate-400" /> 
              <span>Dashboard</span>
            </Link>

            {user.role === 'ADMIN' && (
              <Link 
                to="/admin" 
                className="flex items-center gap-2 text-slate-350 hover:text-red-400 transition text-sm font-semibold tracking-wide"
              >
                <ShieldCheck size={18} className="text-red-500" /> 
                <span>Admin Panel</span>
              </Link>
            )}

            {hasCompletedAny && (
              <span className="animate-pulse flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                ★ EDUNEXUS Certified
              </span>
            )}
            
            <div className="h-5 w-px bg-slate-800"></div>
            
            {/* User Pill Info and Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-slate-200 text-sm font-bold leading-tight">
                  {user.name}
                </span>
                <span className="text-slate-450 text-[10px] uppercase font-mono tracking-tighter">
                  {user.role === 'ADMIN' ? 'Admin Staff' : 'Student Portal'}
                </span>
              </div>
              
              {/* Initials Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md select-none">
                {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'EN'}
              </div>

              <button 
                onClick={toggleTheme}
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-xl text-slate-400 hover:text-white transition"
                title="Toggle Light/Dark Theme"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              <button 
                onClick={handleLogout}
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 rounded-xl text-slate-400 transition"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Logged Out status buttons */
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-xl text-slate-400 hover:text-white transition"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            
            <Link 
              to="/login"
              className="text-xs font-black uppercase tracking-widest text-slate-300 hover:text-emerald-400 transition"
            >
              Sign In
            </Link>
            <Link 
              to="/register"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition active:scale-95"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
export {};
