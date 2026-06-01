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

    const emailNormalized = email ? email.toLowerCase().trim() : '';

    try {
      const response = await api.post('/auth/login', { email: emailNormalized, password });
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

        {/* Google Sign-in option disabled as requested */}

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

      {/* Google Identity Simulator Popup disabled */}
    </div>
  );
};

export default LoginPage;
