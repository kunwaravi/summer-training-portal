import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useUI } from '../context/UIContext';
import { Mail, ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Card from '../components/atoms/Card';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUI();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      addToast('Reset link sent to your email.', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error requesting reset. Please try again.';
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-emerald-600/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="p-8 sm:p-10 border-slate-800/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <KeyRound size={120} className="text-blue-500" />
          </div>

          <div className="text-center relative z-10 mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-2xl mb-6 border border-blue-500/20">
              <ShieldAlert className="text-blue-500" size={28} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
              Forgot <span className="text-blue-500">Password?</span>
            </h2>
            <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
              Request a secure recovery link
            </p>
          </div>

          {success ? (
            <div className="space-y-6 text-center py-4 relative z-10">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                <Mail size={32} className="animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm">Check Your Inbox</h3>
                <p className="text-xs text-slate-450 font-bold leading-relaxed">
                  We've sent a cryptographic reset link to your registered email.
                </p>
              </div>
              <Link to="/login" className="block pt-4">
                <Button variant="outline" className="w-full uppercase tracking-widest text-[10px]">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
              <Input
                label="Registered Email"
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                icon={<Mail size={16} />}
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-14 font-black uppercase tracking-[0.15em] text-sm shadow-lg shadow-blue-600/20"
                variant="accent"
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-slate-800/50 text-center relative z-10">
            <Link
              to="/login"
              className="text-slate-400 hover:text-white font-black uppercase tracking-widest text-[10px] transition inline-flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
