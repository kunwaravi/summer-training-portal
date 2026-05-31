import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Mail, ArrowLeft, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            Reset Password
          </h2>
          <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Request a cryptographic password reset link
          </p>
        </div>

        {success ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 text-lg font-black animate-bounce">
              ✓
            </div>
            <p className="text-xs text-slate-350 font-bold leading-relaxed">
              If that email address exists in our registry, a password reset link has been dispatched. Please check system logs for the simulated link.
            </p>
            <Link
              to="/login"
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl transition hover:opacity-90 shadow block text-center"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Registered Email Address"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-850 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs font-bold font-mono"
                />
              </div>
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
                <span>Request Reset Link</span>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-slate-850">
          <Link
            to="/login"
            className="text-slate-400 hover:text-white font-extrabold uppercase tracking-widest text-[11px] transition inline-flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
