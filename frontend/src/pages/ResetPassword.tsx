import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { Lock, ShieldCheck, ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password complexity helpers
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[@$!%*?&]/.test(newPassword);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Password reset token is missing. Please request a new link.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password does not meet the complexity requirements.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link is invalid or has expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-20 max-w-md mx-auto px-4 flex flex-col items-center justify-center min-h-[85vh]">
      
      {/* Top Return Button */}
      <div className="w-full mb-4 flex justify-start no-print">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>
      </div>

      <div className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none"></div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-white uppercase">Reset Password</h2>
          <p className="text-xs text-slate-400">Establish a secure password for your credentials</p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="space-y-6 py-4 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <ShieldCheck size={36} className="animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-white uppercase tracking-wider">Password Reset Completed!</h3>
                <p className="text-xs text-slate-350 leading-relaxed">
                  Your password has been successfully updated in the secure PostgreSQL registry. You can now login using your new credentials.
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow shadow-cyan-500/10 active:scale-[0.98]"
              >
                Proceed to Login
              </button>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              onSubmit={handleResetSubmit} 
              className="space-y-4"
            >
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="New Password" 
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition text-xs font-bold" 
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="Confirm New Password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition text-xs font-bold" 
                />
              </div>

              {/* Password Complexity helper panel */}
              {newPassword.length > 0 && (
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2 text-left text-[10px] animate-in fade-in duration-200">
                  <p className="font-extrabold uppercase text-slate-500 tracking-wider">Complexity Requirements</p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-slate-400 font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full transition ${hasMinLength ? 'bg-emerald-500 shadow shadow-emerald-500/20' : 'bg-rose-400'}`} />
                      <span>Min 8 characters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full transition ${hasUppercase ? 'bg-emerald-500 shadow shadow-emerald-500/20' : 'bg-rose-400'}`} />
                      <span>One uppercase (A-Z)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full transition ${hasLowercase ? 'bg-emerald-500 shadow shadow-emerald-500/20' : 'bg-rose-400'}`} />
                      <span>One lowercase (a-z)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full transition ${hasNumber ? 'bg-emerald-500 shadow shadow-emerald-500/20' : 'bg-rose-400'}`} />
                      <span>One number (0-9)</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <span className={`w-1.5 h-1.5 rounded-full transition ${hasSpecial ? 'bg-emerald-500 shadow shadow-emerald-500/20' : 'bg-rose-400'}`} />
                      <span>One special symbol (@$!%*?&)</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-2.5 text-left text-xs">
                  <ShieldAlert className="text-red-400 shrink-0 mt-0.5" size={16} />
                  <span className="text-slate-300 leading-tight">{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading || !token}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-800 disabled:to-slate-800 text-white font-extrabold rounded-xl shadow-lg shadow-cyan-500/10 transition duration-200 text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Applying Changes...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResetPassword;
