import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api';
import { useUI } from '../context/UIContext';
import { Lock, ShieldCheck, ArrowLeft, Target, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Card from '../components/atoms/Card';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { addToast } = useUI();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passChecks = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword)
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      addToast('Reset token is missing.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      addToast('Password does not meet security requirements.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
      addToast('Password updated successfully.', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to reset password. Link may be expired.';
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
              <Lock className="text-blue-500" size={28} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
              New <span className="text-blue-500">Password</span>
            </h2>
            <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
              Establish your new secure credentials
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-6 text-center py-4 relative z-10"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <ShieldCheck size={32} className="animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm">Update Complete!</h3>
                  <p className="text-xs text-slate-450 font-bold leading-relaxed">
                    Your password has been securely updated in our encrypted registry.
                  </p>
                </div>
                <Link to="/login" className="block pt-4">
                  <Button variant="accent" className="w-full uppercase tracking-widest text-xs font-black h-12 shadow-lg shadow-blue-600/20">
                    Proceed to Login
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleResetSubmit} 
                className="space-y-6 relative z-10"
              >
                <div className="space-y-4">
                  <Input
                    label="New Secure Password"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={<Lock size={16} />}
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={<Lock size={16} />}
                  />
                </div>

                {newPassword.length > 0 && (
                  <div className="p-5 bg-slate-950/50 border border-slate-800/50 rounded-2xl space-y-3">
                    <p className="text-[11px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                      <Target size={12} className="text-blue-500" /> Complexity Audit
                    </p>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                      {Object.entries({
                        '8+ Chars': passChecks.length,
                        'Uppercase': passChecks.upper,
                        'Lowercase': passChecks.lower,
                        'Number': passChecks.number,
                        'Symbol': passChecks.special
                      }).map(([label, met]) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${met ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`} />
                          <span className={`text-[11px] font-bold uppercase tracking-tight ${met ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  isLoading={isLoading}
                  disabled={!token}
                  className="w-full h-14 font-black uppercase tracking-[0.15em] text-sm shadow-lg shadow-blue-600/20"
                  variant="accent"
                >
                  Update My Password
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-10 pt-8 border-t border-slate-800/50 text-center relative z-10">
            <Link
              to="/login"
              className="text-slate-400 hover:text-white font-black uppercase tracking-widest text-[11px] transition inline-flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Cancel & Return
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
