import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, Zap, CheckCircle, X, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Google OAuth Simulator states
  const [isGoogleOpen, setIsGoogleOpen] = useState(false);
  const [googleStep, setGoogleStep] = useState<'chooser' | 'email' | 'name' | 'loading'>('chooser');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [googleError, setGoogleError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const presetAccounts = [
    { email: 'student.edunexus@gmail.com', name: 'Edunexus Student', avatar: 'ES' },
    { email: 'abhi.kumar@gmail.com', name: 'Abhi Kumar', avatar: 'AK' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials or connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async (emailToAuth: string, nameToAuth: string) => {
    setGoogleError('');
    setGoogleStep('loading');
    try {
      const response = await api.post('/auth/google', {
        email: emailToAuth,
        name: nameToAuth
      });
      login(response.data.token, response.data.user);
      setIsGoogleOpen(false);
      navigate('/dashboard');
    } catch (err: any) {
      setGoogleError(err.response?.data?.message || 'Google Authentication failed.');
      setGoogleStep('chooser');
    }
  };

  const handleCustomEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError('');
    if (!customEmail || !customEmail.includes('@')) {
      setGoogleError('Please enter a valid Google email address.');
      return;
    }
    // Check if it's already a preset account, if so just log in
    const foundPreset = presetAccounts.find(acc => acc.email.toLowerCase() === customEmail.toLowerCase());
    if (foundPreset) {
      handleGoogleAuth(foundPreset.email, foundPreset.name);
      return;
    }
    // Otherwise go to Name step to register
    setGoogleStep('name');
  };

  const handleCustomRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError('');
    if (!customName.trim()) {
      setGoogleError('Please enter your full name.');
      return;
    }
    handleGoogleAuth(customEmail, customName);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
            <Zap className="text-emerald-400 fill-emerald-400/10" size={24} />
            <span>EDUNEXUS</span>
          </Link>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-white uppercase">
            Welcome Back
          </h2>
          <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-850 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs font-bold font-mono"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-850 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs font-bold font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-slate-800 rounded bg-slate-950"
              />
              <label htmlFor="remember-me" className="ml-2 block text-slate-450">
                Remember me
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-emerald-400 hover:text-emerald-300 transition"
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-2xl text-center">
              <p className="text-red-400 text-[10px] font-black uppercase tracking-tight">
                ⚠ {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:opacity-90 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-[0.98] disabled:opacity-75 text-xs uppercase tracking-[0.2em]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={16} /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
            <span className="bg-slate-900 px-3 text-slate-500">Or Continue With</span>
          </div>
        </div>

        <button
          onClick={() => {
            setGoogleStep('chooser');
            setCustomEmail('');
            setCustomName('');
            setGoogleError('');
            setIsGoogleOpen(true);
          }}
          type="button"
          className="w-full bg-slate-950 border border-slate-850 hover:bg-slate-900 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Sign In with Google</span>
        </button>

        <div className="text-center pt-4 border-t border-slate-850">
          <p className="text-slate-450 text-xs font-bold">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-emerald-400 hover:text-emerald-300 font-extrabold uppercase tracking-widest text-[11px] ml-1 transition"
            >
              Sign Up Free <ArrowRight className="inline-block" size={14} />
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Google Identity Simulator Popup */}
      <AnimatePresence>
        {isGoogleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGoogleOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring" as const, duration: 0.4 }}
              className="bg-white text-slate-850 w-full max-w-[420px] rounded-3xl shadow-2xl p-8 sm:p-10 z-10 relative overflow-hidden flex flex-col justify-between min-h-[480px] border border-slate-200"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsGoogleOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>

              <div className="flex-1 flex flex-col justify-center">
                {/* Google Logo */}
                <div className="flex justify-center mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>

                {googleStep === 'chooser' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="text-center space-y-1">
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">Choose an account</h3>
                      <p className="text-xs text-slate-500">to continue to <span className="font-bold text-emerald-600">Edunexus</span></p>
                    </div>

                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {presetAccounts.map((acc) => (
                        <button
                          key={acc.email}
                          onClick={() => handleGoogleAuth(acc.email, acc.name)}
                          className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 border border-slate-100 rounded-2xl text-left transition active:scale-[0.99]"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0">
                            {acc.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate leading-tight">{acc.name}</p>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{acc.email}</p>
                          </div>
                          <ChevronRight size={16} className="text-slate-400 shrink-0" />
                        </button>
                      ))}

                      <button
                        onClick={() => {
                          setGoogleStep('email');
                          setCustomEmail('');
                          setGoogleError('');
                        }}
                        className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-left transition active:scale-[0.99] text-blue-600 font-bold text-xs"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          +
                        </div>
                        <span>Use another account</span>
                      </button>
                    </div>
                  </div>
                )}

                {googleStep === 'email' && (
                  <form onSubmit={handleCustomEmailSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-200">
                    <div className="text-center space-y-1">
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">Sign in with Google</h3>
                      <p className="text-xs text-slate-500">Use your Google Account</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">Email or phone</label>
                        <input
                          type="email"
                          required
                          value={customEmail}
                          onChange={(e) => setCustomEmail(e.target.value)}
                          placeholder="name@gmail.com"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition font-medium"
                          autoFocus
                        />
                      </div>

                      {googleError && (
                        <p className="text-[11px] font-bold text-red-500 bg-red-50 border border-red-100 p-2.5 rounded-xl text-center">
                          ⚠ {googleError}
                        </p>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <button
                          type="button"
                          onClick={() => setGoogleStep('chooser')}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <ArrowLeft size={14} /> Back
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {googleStep === 'name' && (
                  <form onSubmit={handleCustomRegisterSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-200">
                    <div className="text-center space-y-1">
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">One Last Step</h3>
                      <p className="text-xs text-slate-500">Tell us your name to link your Google Profile</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-450">Google Account Name</label>
                        <input
                          type="text"
                          required
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="e.g. Abhi Kumar"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition font-medium"
                          autoFocus
                        />
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">This name will be displayed on your dashboard.</p>
                      </div>

                      {googleError && (
                        <p className="text-[11px] font-bold text-red-500 bg-red-50 border border-red-100 p-2.5 rounded-xl text-center">
                          ⚠ {googleError}
                        </p>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <button
                          type="button"
                          onClick={() => setGoogleStep('email')}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <ArrowLeft size={14} /> Back
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
                        >
                          Link & Sign In
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {googleStep === 'loading' && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in duration-200">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Securing Google Session...</p>
                  </div>
                )}
              </div>

              {/* Google Simulator Footer */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 font-medium">
                <span>English (United States)</span>
                <div className="flex gap-3">
                  <a href="#help" className="hover:underline">Help</a>
                  <a href="#privacy" className="hover:underline">Privacy</a>
                  <a href="#terms" className="hover:underline">Terms</a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
