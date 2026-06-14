import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Mail, Lock, User, GraduationCap, UserPlus, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Card from '../components/atoms/Card';
import FloatingParticles from '../components/atoms/FloatingParticles';

interface LoginPageProps {
  mode?: 'login' | 'register';
}

const LoginPage: React.FC<LoginPageProps> = ({ mode = 'login' }) => {
  const [searchParams] = useSearchParams();
  const isLogin = mode === 'login';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fatherName: '',
    collegeName: '',
    branchName: '',
    password: '',
    referredBy: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);

  const { login } = useAuth();
  const { addToast } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referredBy: refCode }));
    }
  }, [searchParams]);

  // Reset form inputs when switching modes to avoid leaking text
  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      fatherName: '',
      collegeName: '',
      branchName: '',
      password: '',
      referredBy: searchParams.get('ref') || ''
    });
  }, [mode, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const passChecks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[@$!%*?&]/.test(formData.password)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(false);

    const emailNormalized = formData.email ? formData.email.toLowerCase().trim() : '';

    if (!isLogin) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setShakeTrigger(prev => prev + 1);
        addToast('Password does not meet security requirements.', 'error');
        return;
      }
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email: emailNormalized, password: formData.password }
        : { ...formData, email: emailNormalized };

      const response = await api.post(endpoint, payload);
      
      // Trigger satisfying success state
      setIsSuccess(true);
      
      // Hold for animation complete, then log in
      setTimeout(() => {
        login(response.data.token, response.data.user);
        addToast(
          isLogin
            ? `Welcome back, ${response.data.user.name}!`
            : 'Account created successfully! Welcome to the portal.',
          'success'
        );
        navigate('/dashboard');
      }, 1500);

    } catch (err: any) {
      setShakeTrigger(prev => prev + 1);
      const msg = err.response?.data?.message || 'Authentication failed. Please check your inputs.';
      addToast(msg, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 relative">
      <FloatingParticles />

      <motion.div
        animate={shakeTrigger > 0 ? {
          x: [0, -10, 10, -10, 10, -5, 5, 0],
          transition: { duration: 0.4 }
        } : {}}
        key={shakeTrigger}
        className="max-w-xl w-full relative z-10"
      >
        <Card 
          className="p-8 sm:p-10 border-slate-850 bg-slate-900/60 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all duration-350"
        >
          {/* Success Checkmark Animation Overlay */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center z-30"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 120, delay: 0.1 }}
                  className="flex flex-col items-center space-y-4"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/5">
                    <svg className="w-10 h-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45, delay: 0.3 }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wider">Success!</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center px-6">
                    {isLogin ? 'Authenticating secure session...' : 'Creating student profile...'}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-0 right-0 p-4 opacity-5">
            {isLogin ? (
              <ShieldCheck size={120} className="text-blue-500" />
            ) : (
              <UserPlus size={120} className="text-blue-500" />
            )}
          </div>

          <div className="text-center relative z-10 mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-2xl mb-4 border border-blue-500/20 shadow-inner">
              {isLogin ? (
                <LogIn className="text-blue-500" size={24} />
              ) : (
                <UserPlus className="text-blue-500" size={24} />
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase italic">
              {isLogin ? 'Member' : 'Student'}{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {isLogin ? 'Login' : 'Registration'}
              </span>
            </h2>
            <p className="mt-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {isLogin ? 'Access your training dashboard' : 'Start your professional certification journey'}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
            <div className="space-y-4">
              
              {/* Registration Only Fields */}
              <AnimatePresence initial={false}>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden"
                  >
                    <Input
                      label="Full Name"
                      name="name"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      icon={<User size={16} />}
                      className="focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                    />

                    <Input
                      label="Father's Name"
                      name="fatherName"
                      required={!isLogin}
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder="Parent Name"
                      icon={<ShieldCheck size={16} />}
                      className="focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                    />

                    <Input
                      label="College/Institute"
                      name="collegeName"
                      required={!isLogin}
                      value={formData.collegeName}
                      onChange={handleChange}
                      placeholder="University Name"
                      icon={<GraduationCap size={16} />}
                      className="focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                    />

                    <Input
                      label="Branch/Stream"
                      name="branchName"
                      required={!isLogin}
                      value={formData.branchName}
                      onChange={handleChange}
                      placeholder="e.g. CSE, ECE, EE"
                      icon={<GraduationCap size={16} />}
                      className="focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Common Fields */}
              <Input
                label="Registered Email"
                id="email-address"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                icon={<Mail size={16} />}
                className="focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              />

              <div className="space-y-1.5">
                <Input
                  label="Secure Password"
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  className="focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                />
                
                {isLogin && (
                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-[9px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                )}
              </div>

              {/* Password checks for register */}
              {!isLogin && formData.password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-850/60 text-[10px] text-slate-400 space-y-2 font-mono"
                >
                  <p className="text-slate-500 uppercase font-black tracking-wider">Security Constraints:</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <div className={`flex items-center gap-1.5 ${passChecks.length ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      <span>{passChecks.length ? '✔' : '✖'}</span> Min 8 Characters
                    </div>
                    <div className={`flex items-center gap-1.5 ${passChecks.upper ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      <span>{passChecks.upper ? '✔' : '✖'}</span> Uppercase Letter
                    </div>
                    <div className={`flex items-center gap-1.5 ${passChecks.lower ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      <span>{passChecks.lower ? '✔' : '✖'}</span> Lowercase Letter
                    </div>
                    <div className={`flex items-center gap-1.5 ${passChecks.number ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      <span>{passChecks.number ? '✔' : '✖'}</span> One Number
                    </div>
                    <div className={`flex items-center gap-1.5 ${passChecks.special ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      <span>{passChecks.special ? '✔' : '✖'}</span> Special Character
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Optional Referral Code for Register */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      label="Referral Code (Optional)"
                      name="referredBy"
                      value={formData.referredBy}
                      onChange={handleChange}
                      placeholder="REF-XXXX-XXXX"
                      icon={<UserPlus size={16} />}
                      className="focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full mt-4 h-12 font-black uppercase tracking-[0.15em] text-xs shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
              variant="accent"
              rightIcon={<ArrowRight size={14} />}
            >
              {isLogin ? 'Sign In Now' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-850/60 text-center relative z-10">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              {isLogin ? 'New to Edunexus?' : 'Already have an account?'}{' '}
              <button
                onClick={() => navigate(isLogin ? '/register' : '/login')}
                className="text-blue-400 hover:text-blue-300 font-black ml-1 transition underline decoration-2 underline-offset-4"
              >
                {isLogin ? 'Join Free' : 'Login Here'}
              </button>
            </p>
          </div>
        </Card>

        <p className="mt-6 text-center text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] select-none">
          Secure Infrastructure &bull; Verified Credentials
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
