import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Card from '../components/atoms/Card';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useUI();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const emailNormalized = email ? email.toLowerCase().trim() : '';

    try {
      const response = await api.post('/auth/login', { email: emailNormalized, password });
      login(response.data.token, response.data.user);
      addToast(`Welcome back, ${response.data.user.name}!`, 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      {/* Dynamic Background */}
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
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck size={120} className="text-blue-500" />
          </div>

          <div className="text-center relative z-10">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-2xl mb-6 border border-blue-500/20">
              <LogIn className="text-blue-500" size={28} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
              Member <span className="text-blue-500">Login</span>
            </h2>
            <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
              Access your training dashboard
            </p>
          </div>

          <form className="mt-10 space-y-5 relative z-10" onSubmit={handleSubmit}>
            <div className="space-y-4">
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

              <div className="space-y-1.5">
                <Input
                  label="Secure Password"
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                />
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full mt-4 h-14 font-black uppercase tracking-[0.15em] text-sm shadow-lg shadow-blue-600/20"
              variant="accent"
              rightIcon={<ArrowRight size={18} />}
            >
              Sign In Now
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-800/50 text-center relative z-10">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              New to Edunexus?{' '}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-black ml-1 transition underline decoration-2 underline-offset-4"
              >
                Join Free
              </Link>
            </p>
          </div>
        </Card>
        
        <p className="mt-8 text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
          Secure Infrastructure &bull; ISO 9001:2015
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
