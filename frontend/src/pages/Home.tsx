import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Mail, Lock, User, GraduationCap, Award, BookOpen, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = isLogin 
        ? { email, password } 
        : { email, password, name, fatherName, collegeName, branchName };
      
      const response = await api.post(endpoint, data);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials or connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-[82vh] gap-12 py-8 px-2 max-w-6xl mx-auto">
      
      {/* Brand & Introduction Side */}
      <motion.div 
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 text-center lg:text-left space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold tracking-wide">
          <ShieldCheck size={16} /> NEXUS Embedded Systems & IoT Solutions
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
          Industrial Training & <br />
          <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
            Electronics Innovation
          </span>
        </h1>
        <p className="text-slate-350 text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
          Access specialized summer training curriculum modules covering C systems programming, object-oriented design, IoT controllers, connectivity, and real-time RTOS microkernels.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-xl mx-auto lg:mx-0">
          <div className="flex items-center gap-3 p-3.5 bg-slate-800/40 border border-slate-700/50 rounded-xl">
            <BookOpen className="text-amber-400 shrink-0" size={24} />
            <div className="text-left">
              <p className="text-white font-semibold text-sm">Industrial Curriculum</p>
              <p className="text-slate-400 text-xs">Structured lessons</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 bg-slate-800/40 border border-slate-700/50 rounded-xl">
            <Clock className="text-amber-400 shrink-0" size={24} />
            <div className="text-left">
              <p className="text-white font-semibold text-sm">Graded Assessments</p>
              <p className="text-slate-400 text-xs">Weekly online quizzes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 bg-slate-800/40 border border-slate-700/50 rounded-xl">
            <Award className="text-amber-400 shrink-0" size={24} />
            <div className="text-left">
              <p className="text-white font-semibold text-sm">NEXUS Certification</p>
              <p className="text-slate-400 text-xs">Verified credentials</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Authentication Form Side */}
      <motion.div 
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="relative bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
          
          {/* Decorative glowing gradient sphere */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-white to-slate-350 bg-clip-text text-transparent">
            {isLogin ? 'Student Login' : 'Student Registration'}
          </h2>
          <p className="text-center text-slate-400 text-sm mb-6">
            {isLogin ? 'Sign in to access NEXUS training portal' : 'Enroll in smart electronics programs'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-450" size={18} />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 text-white placeholder-slate-450 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm" 
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-450" size={18} />
                    <input 
                      type="text" 
                      placeholder="Father's Name" 
                      value={fatherName} 
                      onChange={(e) => setFatherName(e.target.value)} 
                      required 
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 text-white placeholder-slate-450 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm" 
                    />
                  </div>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 text-slate-450" size={18} />
                    <input 
                      type="text" 
                      placeholder="College Name" 
                      value={collegeName} 
                      onChange={(e) => setCollegeName(e.target.value)} 
                      required 
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 text-white placeholder-slate-450 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm" 
                    />
                  </div>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 text-slate-455" size={18} />
                    <input 
                      type="text" 
                      placeholder="Branch (e.g. ECE, EEE, CSE)" 
                      value={branchName} 
                      onChange={(e) => setBranchName(e.target.value)} 
                      required 
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 text-white placeholder-slate-450 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-450" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 text-white placeholder-slate-450 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm" 
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-455" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 text-white placeholder-slate-450 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm" 
              />
            </div>
            
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-red-400 text-xs font-semibold pl-1"
              >
                ⚠ {error}
              </motion.p>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 text-slate-950 shadow-lg shadow-amber-500/10 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
              ) : isLogin ? (
                <><LogIn size={18} /> Login</>
              ) : (
                <><UserPlus size={18} /> Enroll Now</>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-slate-400 text-sm">
            {isLogin ? "New to the portal?" : "Already enrolled?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="ml-2 text-amber-450 hover:underline font-semibold"
            >
              {isLogin ? 'Create Account' : 'Login Here'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
