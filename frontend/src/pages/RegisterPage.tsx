import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, GraduationCap, Target, UserPlus, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        collegeName,
        branchName,
        password
      });

      // Auto login after successful registration
      login(response.data.token, response.data.user);
      navigate('/dashboard');
      } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Check network or email constraints.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatedVerificationBypass = async () => {
    setIsLoading(true);
    try {
      // Simulate verification on the backend to let them log in directly
      // In seed/dev, we can just do a mock bypass or use the login route directly since they just signed up
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Verification bypass failed. Please complete standard activation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/google', {
        email: email || 'new.student@gmail.com',
        name: name || 'Google Student',
      });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Google Sign-up failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
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
            Create Account
          </h2>
          <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Join the premium learning portal
          </p>
        </div>

        {success ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 text-lg font-black animate-bounce">
              ✓
            </div>
            <p className="text-xs text-slate-350 font-bold leading-relaxed">
              {success}
            </p>
            <button
              onClick={handleSimulatedVerificationBypass}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl transition hover:opacity-90 shadow"
            >
              {isLoading ? 'Activating Profile...' : 'Simulate Verification & Login'}
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-850 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs font-bold"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-850 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs font-bold font-mono"
                />
              </div>

              <div className="relative">
                <GraduationCap className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="College Name"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-850 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs font-bold"
                />
              </div>

              <div className="relative">
                <Target className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Branch (e.g. CSE, ECE, EEE)"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-850 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs font-bold"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create Secure Password"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-850 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs font-bold font-mono"
                />
              </div>
            </div>

            {password.length > 0 && (
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2 text-[10px] animate-in fade-in duration-200">
                <p className="font-extrabold uppercase text-slate-450 tracking-wider">Complexity Checklist</p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-slate-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full transition ${password.length >= 8 ? 'bg-emerald-400 shadow shadow-emerald-400/20' : 'bg-red-400'}`} />
                    <span>Min 8 characters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full transition ${/[A-Z]/.test(password) ? 'bg-emerald-400 shadow shadow-emerald-400/20' : 'bg-red-400'}`} />
                    <span>One uppercase (A-Z)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full transition ${/[a-z]/.test(password) ? 'bg-emerald-400 shadow shadow-emerald-400/20' : 'bg-red-400'}`} />
                    <span>One lowercase (a-z)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full transition ${/\d/.test(password) ? 'bg-emerald-400 shadow shadow-emerald-400/20' : 'bg-red-400'}`} />
                    <span>One number (0-9)</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <span className={`w-1.5 h-1.5 rounded-full transition ${/[@$!%*?&]/.test(password) ? 'bg-emerald-400 shadow shadow-emerald-400/20' : 'bg-red-400'}`} />
                    <span>One special symbol (@$!%*?&)</span>
                  </div>
                </div>
              </div>
            )}

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
                  <UserPlus size={16} /> Create Account
                </>
              )}
            </button>
          </form>
        )}

        {!success && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                <span className="bg-slate-900 px-3 text-slate-500">Or Register With</span>
              </div>
            </div>

            <button
              onClick={handleGoogleRegister}
              type="button"
              className="w-full bg-slate-950 border border-slate-850 hover:bg-slate-900 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Sign Up with Google</span>
            </button>
          </>
        )}

        <div className="text-center pt-4 border-t border-slate-850">
          <p className="text-slate-450 text-xs font-bold">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-emerald-400 hover:text-emerald-300 font-extrabold uppercase tracking-widest text-[11px] ml-1 transition"
            >
              Sign In <ArrowRight className="inline-block" size={14} />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
