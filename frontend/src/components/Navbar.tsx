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
        
        {/* Brand logo - EDUNEXUS */}
        <Link 
          to={user ? "/dashboard" : "/"} 
          className="text-2xl font-black flex items-center gap-2.5 tracking-wide hover:scale-[1.01] transition-transform select-none"
        >
          <img src="/logo.png" alt="Edunexus Logo" className="h-9 w-auto" />
          <span className="font-extrabold uppercase text-slate-100 tracking-wider text-xl sm:text-2xl">
            EDUNE
            <span 
              className="inline-block align-middle" 
              style={{
                background: 'linear-gradient(90deg, #f1f5f9 50%, #d4af37 50%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              X
            </span>
            US
            <span className="text-[#d4af37] font-black ml-1.5">LAB</span>
          </span>
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

            <a 
              href="https://t.me/+tCapxtLwxNNlZjY1" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-[#0088cc] hover:text-[#00aaff] transition text-sm font-semibold tracking-wide"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.96 1.25-5.54 3.67-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.36-.48.98-.74 3.84-1.67 6.4-2.77 7.68-3.3 3.64-1.51 4.4-1.78 4.89-1.79.11 0 .35.03.48.14.11.09.14.22.15.34-.01.07-.01.2-.02.32z"/>
              </svg>
              <span>Join Telegram</span>
            </a>

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
            <a 
              href="https://t.me/+tCapxtLwxNNlZjY1" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden sm:flex items-center gap-1.5 text-[#0088cc] hover:text-[#00aaff] transition text-xs font-black uppercase tracking-widest"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.96 1.25-5.54 3.67-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.36-.48.98-.74 3.84-1.67 6.4-2.77 7.68-3.3 3.64-1.51 4.4-1.78 4.89-1.79.11 0 .35.03.48.14.11.09.14.22.15.34-.01.07-.01.2-.02.32z"/>
              </svg>
              Telegram Group
            </a>
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
