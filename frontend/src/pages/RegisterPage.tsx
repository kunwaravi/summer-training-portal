import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Mail, Lock, User, GraduationCap, Target, UserPlus, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Card from '../components/atoms/Card';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
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

  const { login } = useAuth();
  const { addToast } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referredBy: refCode }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      addToast('Password does not meet security requirements.', 'error');
      return;
    }

    setIsLoading(true);
    const emailNormalized = formData.email ? formData.email.toLowerCase().trim() : '';

    try {
      const response = await api.post('/auth/register', {
        ...formData,
        email: emailNormalized
      });

      login(response.data.token, response.data.user);
      addToast('Account created successfully! Welcome to the portal.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your details.';
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const passChecks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[@$!%*?&]/.test(formData.password)
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-emerald-600/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-8 sm:p-10 border-slate-800/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <UserPlus size={160} className="text-blue-500" />
          </div>

          <div className="text-center relative z-10 mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-2xl mb-6 border border-blue-500/20">
              <UserPlus className="text-blue-500" size={28} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
              Student <span className="text-blue-500">Registration</span>
            </h2>
            <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
              Start your professional certification journey
            </p>
          </div>

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                icon={<User size={16} />}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                icon={<Mail size={16} />}
              />
              <Input
                label="Father's Name"
                name="fatherName"
                required
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Parent Name"
                icon={<ShieldCheck size={16} />}
              />
              <Input
                label="College/Institute"
                name="collegeName"
                required
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="University Name"
                icon={<GraduationCap size={16} />}
              />
              <Input
                label="Branch/Stream"
                name="branchName"
                required
                value={formData.branchName}
                onChange={handleChange}
                placeholder="e.g. CSE, ECE"
                icon={<Briefcase size={16} />}
              />
              <Input
                label="Create Password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={<Lock size={16} />}
              />
              <Input
                label="Referral Code (Optional)"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                placeholder="REF-XXXX-XXXX"
                icon={<UserPlus size={16} />}
              />
            </div>

            {formData.password.length > 0 && (
              <div className="p-5 bg-slate-950/50 border border-slate-800/50 rounded-2xl space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                  <Target size={12} className="text-blue-500" /> Security Strength
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries({
                    '8+ Chars': passChecks.length,
                    'Uppercase': passChecks.upper,
                    'Lowercase': passChecks.lower,
                    'Number': passChecks.number,
                    'Symbol': passChecks.special
                  }).map(([label, met]) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full transition-colors ${met ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-tight ${met ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-14 font-black uppercase tracking-[0.15em] text-sm shadow-lg shadow-blue-600/20"
                variant="accent"
                rightIcon={<ArrowRight size={18} />}
              >
                Create My Account
              </Button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-800/50 text-center relative z-10">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-black ml-1 transition underline decoration-2 underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
