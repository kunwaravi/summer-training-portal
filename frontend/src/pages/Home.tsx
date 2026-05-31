import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, UserPlus, Mail, Lock, User, GraduationCap, BookOpen, 
  ChevronDown, ChevronUp, CheckCircle2,  
  Target, Award, Users, MessageCircle, FileText, Gift,
  Globe, Zap, ArrowRight, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { coursesConfig } from '../config/courses';

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password flow states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordSuccess(false);
    setForgotPasswordLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: forgotPasswordEmail });
      setForgotPasswordSuccess(true);
    } catch (err: any) {
      setForgotPasswordError(err.response?.data?.message || 'Connection error. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Accordion active week syllabus previews
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        setError('Password must be at least 8 characters, and contain uppercase, lowercase, numbers, and special characters (@$!%*?&).');
        return;
      }
    }

    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = isLogin 
        ? { email, password } 
        : { email, password, name, collegeName, branchName };
      
      const response = await api.post(endpoint, data);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials or connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToEnroll = () => {
    const el = document.getElementById('enrollment-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleSyllabus = (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(courseId);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* 1. Navbar / Top Banner */}
      <div className="bg-indigo-950 text-white py-2 px-4 text-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
        🚀 Registration Open for Summer Training Batch 2026 • ISO 9001:2015 Certified
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-24 pb-24">
        
        {/* 2. Hero Section: Better than Indigo */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-16 min-h-[70vh]">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
              <Zap size={14} className="fill-indigo-600" /> Learn Today • Lead Tomorrow
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight text-indigo-950">
              BUILD SKILLS THAT <br />
              <span className="text-blue-600 italic">BUILD YOUR CAREER</span>
            </h1>
            
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Join India's most advanced industrial training portal. Master Embedded Systems, IoT, and Systems Programming with ISO-certified curriculum and expert mentorship.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
              <button 
                onClick={scrollToEnroll}
                className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all transform active:scale-95 shadow-xl shadow-indigo-600/20 flex items-center gap-2"
              >
                Workshop Registration <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={scrollToEnroll}
                className="px-8 py-4 bg-white border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-700 font-black rounded-2xl text-xs uppercase tracking-widest transition-all"
              >
                Summer Training
              </button>
            </div>

            <div className="flex items-center gap-6 justify-center lg:justify-start pt-4 border-t border-slate-100">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="student" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  +1k
                </div>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                Trusted by <span className="text-indigo-600">1,250+ Students</span> across India
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex-1 w-full max-w-lg relative hidden lg:block"
          >
            <div className="relative p-2 bg-slate-100 rounded-[2.5rem] shadow-inner overflow-hidden border border-slate-200">
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
                  alt="Industrial Lab" 
                  className="w-full aspect-[4/5] object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                  <div className="flex gap-1 text-yellow-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-lg font-black leading-tight italic">"The most practical embedded course I've ever taken!"</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">— Gaurav Singh, Technical Director</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3. Why Choose Us: Benefits Section */}
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Excellence Defined</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-indigo-950 tracking-tight">Why Choose Our Training?</h3>
            <p className="text-slate-500 text-sm font-medium">We don't just teach code; we architect careers with industrial precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Zap />, title: 'Practical Learning', desc: 'Hands-on hardware interfacing and real-time project development cycles.' },
              { icon: <Users />, title: 'Mentor Support', desc: 'Direct access to industry experts and personalized code reviews.' },
              { icon: <Award />, title: 'ISO Certification', desc: 'Industry-recognized verifiable credentials with unique QR tracking.' },
              { icon: <MessageCircle />, title: 'Recorded Lectures', desc: 'Lifetime access to all session recordings and module walk-throughs.' },
              { icon: <Target />, title: 'Career Guidance', desc: 'Placement assistance, resume building, and mock interview prep.' },
              { icon: <FileText />, title: 'Resource Hub', desc: 'Complete access to exclusive notes, project files, and library.' },
            ].map((benefit, i) => (
              <div key={i} className="group p-8 bg-white border border-slate-100 rounded-3xl hover:border-indigo-600/20 hover:shadow-2xl hover:shadow-indigo-600/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {benefit.icon}
                </div>
                <h4 className="text-xl font-bold text-indigo-950 mb-2">{benefit.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Course Catalog: Ultra-Premium Cards */}
        <div id="catalog-section" className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Curriculum</h2>
              <h3 className="text-3xl sm:text-4xl font-black text-indigo-950 tracking-tight">Accredited Learning Tracks</h3>
            </div>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
              <button className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-indigo-600 shadow-sm">All Courses</button>
              <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition">Embedded</button>
              <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition">IoT</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coursesConfig.map((course) => {
              const isExpanded = expandedCourse === course.id;

              return (
                <div 
                  key={course.id}
                  className={`bg-white border-2 rounded-[2rem] p-8 transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-indigo-600/10 ${
                    isExpanded ? 'border-indigo-600' : 'border-slate-50'
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className={`w-14 h-14 rounded-2xl ${course.iconColor} flex items-center justify-center text-2xl`}>
                        <BookOpen size={28} />
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                          Active Batch
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-indigo-950 tracking-tight">{course.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tag}</span>
                        ))}
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed pt-2">{course.desc}</p>
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={() => toggleSyllabus(course.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-xs font-black transition-all ${
                          isExpanded 
                            ? 'bg-indigo-600 border-indigo-600 text-white' 
                            : 'bg-slate-50 border-slate-50 text-indigo-950 hover:border-indigo-100 hover:bg-white'
                        }`}
                      >
                        <span className="flex items-center gap-2 uppercase tracking-widest">
                          <FileText size={16} /> {isExpanded ? "Hide Syllabus Details" : "View Syllabus Breakdown"}
                        </span>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mt-6 space-y-4"
                          >
                            <div className="grid grid-cols-1 gap-4">
                              {course.syllabus.map((syll) => (
                                <div key={syll.order} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-start">
                                  <span className="text-xs font-black text-indigo-600 bg-white w-10 h-10 flex items-center justify-center rounded-xl shadow-sm border border-indigo-50 shrink-0">
                                    W{syll.order}
                                  </span>
                                  <div>
                                    <p className="text-sm font-bold text-indigo-950 leading-tight">{syll.title}</p>
                                    <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{syll.details}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-indigo-600 fill-indigo-600" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{course.difficulty}</span>
                    </div>
                    <button 
                      onClick={scrollToEnroll}
                      className="text-xs font-black uppercase text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 group"
                    >
                      Enroll in Track <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Ambassador Program: Referral Rewards */}
        <div className="relative rounded-[3rem] bg-indigo-600 p-8 sm:p-16 overflow-hidden shadow-2xl shadow-indigo-600/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] -ml-32 -mb-32"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center lg:text-left text-white">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-200">Ambassador Program</h2>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Learn for Free & <br />
                <span className="text-blue-200">Get Paid to Refer</span>
              </h3>
              <p className="text-indigo-100 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
                Join our Campus Ambassador program and earn exclusive rewards for every friend you refer to our training portal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <Gift className="mb-2 text-blue-200" />
                  <p className="text-xs font-black uppercase tracking-widest">50% Discount</p>
                  <p className="text-[10px] text-indigo-100 mt-1">On 3 Referrals</p>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <Star className="mb-2 text-yellow-400" />
                  <p className="text-xs font-black uppercase tracking-widest">100% Free</p>
                  <p className="text-[10px] text-indigo-100 mt-1">On 5 Referrals</p>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <Zap className="mb-2 text-emerald-400" />
                  <p className="text-xs font-black uppercase tracking-widest">Paid Intern</p>
                  <p className="text-[10px] text-indigo-100 mt-1">On 10+ Referrals</p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-full max-w-xs bg-white rounded-[2rem] p-8 shadow-2xl">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Users size={32} />
                </div>
                <h4 className="text-indigo-950 font-black uppercase tracking-widest text-sm">Become an Ambassador</h4>
                <p className="text-slate-500 text-xs font-medium">Join 200+ ambassadors already earning with Nexus Labs.</p>
                <button 
                  onClick={scrollToEnroll}
                  className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
                >
                  Join Program
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Resources & Community Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 sm:p-12 bg-slate-50 rounded-[3rem] space-y-8 border border-slate-100">
            <h3 className="text-2xl font-black text-indigo-950 tracking-tight">Resource Library</h3>
            <div className="space-y-4">
              {[
                { title: 'Project Source Files', desc: 'Download C/C++ libraries and ESP32 drivers.', icon: <FileText /> },
                { title: 'Training Handouts', desc: 'Summary notes for all 4 weeks of training.', icon: <BookOpen /> },
                { title: 'Placement Guide', desc: 'Top embedded companies interview questions.', icon: <Target /> },
              ].map((res, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200/50 hover:border-indigo-600/30 transition shadow-sm group">
                  <div className="text-indigo-600 mt-1 group-hover:scale-110 transition-transform">{res.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-indigo-950">{res.title}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{res.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 sm:p-12 bg-indigo-50 rounded-[3rem] space-y-8 border border-indigo-100 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-100 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-black text-indigo-950 tracking-tight relative z-10">Student Community</h3>
            <div className="space-y-6 relative z-10">
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Join our active WhatsApp groups to discuss projects, clear doubts, and get real-time updates from mentors.
              </p>
              <div className="flex flex-col gap-3">
                <button className="flex items-center justify-between p-5 bg-white rounded-2xl border border-indigo-200 text-indigo-600 font-black uppercase tracking-widest text-xs hover:shadow-lg transition group">
                  <span className="flex items-center gap-3"><MessageCircle size={20} className="text-emerald-500" /> WhatsApp Community</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex items-center justify-between p-5 bg-white rounded-2xl border border-indigo-200 text-indigo-600 font-black uppercase tracking-widest text-xs hover:shadow-lg transition group">
                  <span className="flex items-center gap-3"><Globe size={20} className="text-blue-500" /> LinkedIn Network</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Enrollment CTA Section */}
        <div id="enrollment-section" className="relative rounded-[3rem] bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-16 overflow-hidden shadow-2xl text-center">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -ml-32 -mt-32"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] -mr-32 -mb-32"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em]">Start Today</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight uppercase">
              Ready to Accelerate <br />
              <span className="text-emerald-400">Your Engineering Career?</span>
            </h3>
            <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
              Join thousands of students learning C/C++, Embedded Systems, IoT, and AI. Get certified with industry-recognized verifiable credentials.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link 
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-widest hover:opacity-95 transition-all transform active:scale-95 shadow-xl shadow-emerald-500/10 flex items-center gap-2"
              >
                Create Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login"
                className="px-8 py-4 bg-slate-950 border-2 border-slate-800 hover:border-emerald-500 hover:text-emerald-400 text-slate-350 font-black rounded-2xl text-xs uppercase tracking-widest transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* 8. Footer */}
        <div className="pt-24 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-4">
            <h4 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Zap size={18} className="text-emerald-400 fill-emerald-400/15" /> Edunexus Labs
            </h4>
            <p className="text-slate-500 text-xs font-medium max-w-sm">
              Empowering the next generation of engineers with high-fidelity hardware expertise, computer science logic, and accredited certifications.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px]">ISO 9001:2015 Accredited Organization</p>
            <p className="text-slate-500 text-[10px] font-bold">© 2026 Edunexus Automation Labs • Ghaziabad, UP</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;

