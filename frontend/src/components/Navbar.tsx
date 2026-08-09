import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, ShieldCheck, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import Button from './atoms/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useUI();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('Successfully signed out.', 'info');
    navigate('/login');
  };

  // Check if user has completed at least one training track
  const hasCompletedAny = user?.progresses?.some((p: any) => p.completed) || false;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900/50 py-3.5 no-print">
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        {/* Brand logo - EDUNEXUS */}
        <Link 
          to={user ? "/dashboard" : "/"} 
          className="group flex items-center gap-3 select-none"
        >
          <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <img src="/logo.png" alt="Edunexus Logo" className="h-6 w-auto brightness-0 invert" />
          </div>
          <span className="font-black uppercase text-white tracking-tighter text-lg sm:text-xl">
            EDUNE<span className="text-blue-500">X</span>US
            <span className="text-slate-500 font-bold ml-1.5 text-sm">PRO</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {user && (
            <div className="flex items-center gap-6">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                <LayoutDashboard size={14} /> 
                Dashboard
              </Link>

              {user.role === 'ADMIN' && (
                <Link 
                  to="/admin" 
                  className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  <ShieldCheck size={14} className="text-blue-500" /> 
                  Admin Portal
                </Link>
              )}

              {hasCompletedAny && (
                <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[11px] text-emerald-400 font-black uppercase tracking-widest shadow-lg shadow-emerald-500/5">
                  ★ Certified
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 border-l border-slate-850 pl-8">
            <button
              onClick={toggleTheme}
              className="p-2 bg-slate-900 border border-slate-850 hover:bg-slate-850 text-slate-300 hover:text-white rounded-lg transition-all active:scale-95"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer group">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-blue-700 text-white font-black text-[11px] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'EN'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-slate-200 text-[11px] font-black uppercase tracking-wider leading-none">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-slate-500 text-[11px] font-bold uppercase mt-0.5">
                      {user.role === 'ADMIN' ? 'Staff' : 'Student'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleLogout}
                  className="p-2 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 rounded-lg text-slate-400 transition-all active:scale-95"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="px-4">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="accent" size="sm" className="px-5 font-black uppercase tracking-widest shadow-blue-600/20">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-400"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-950 border-b border-slate-900 py-6 px-4 space-y-6 shadow-2xl">
          {user ? (
            <>
              <div className="flex items-center gap-4 pb-6 border-b border-slate-900">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-700 text-white font-black text-sm flex items-center justify-center shadow-xl">
                  {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'EN'}
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">{user.name}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{user.role} Account</p>
                </div>
              </div>
              <div className="grid gap-4">
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 bg-slate-900 rounded-xl text-sm font-bold uppercase tracking-widest text-slate-300">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 bg-slate-900 rounded-xl text-sm font-bold uppercase tracking-widest text-blue-400">
                    <ShieldCheck size={18} /> Admin Portal
                  </Link>
                )}
                <button 
                  onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 p-4 bg-slate-900 rounded-xl text-sm font-bold uppercase tracking-widest text-slate-300"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} 
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button onClick={handleLogout} className="flex items-center gap-3 p-4 bg-red-500/5 rounded-xl text-sm font-bold uppercase tracking-widest text-red-400">
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="grid gap-3">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button variant="accent" className="w-full">Create Free Account</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
