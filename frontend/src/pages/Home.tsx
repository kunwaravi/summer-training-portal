import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, UserPlus, Mail, Lock, User, GraduationCap, BookOpen, 
  ShieldCheck, ChevronDown, ChevronUp, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const courseDetails = [
  {
    id: 'C',
    title: 'C & Systems Programming',
    difficulty: 'Beginner to Intermediate',
    tags: ['Core Electronics', 'Hardware Mapping'],
    color: 'from-blue-500/20 via-blue-600/10 to-transparent border-blue-500/30',
    iconColor: 'text-blue-400 bg-blue-500/10',
    desc: 'Master procedural programming, binary systems, hardware mapping, memory allocations, and register compilations.',
    syllabus: [
      { week: 1, title: 'Procedural Fundamentals', details: 'Variables, Data Types, Control Flows, and Memory Layouts' },
      { week: 2, title: 'Modular Architecture', details: 'Functions, Scopes, Arrays, and Pointer Arithmetic' },
      { week: 3, title: 'Structures & I/O Systems', details: 'Dynamic Memory Allocation, Structs, and Hardware File I/O' },
      { week: 4, title: 'Low-Level Register Macros', details: 'Compilation pipelines, Register keywords, and direct hardware macros' }
    ]
  },
  {
    id: 'C++',
    title: 'C++ & OOP for Embedded Systems',
    difficulty: 'Intermediate',
    tags: ['Object-Oriented', 'High Performance'],
    color: 'from-purple-500/20 via-purple-600/10 to-transparent border-purple-500/30',
    iconColor: 'text-purple-400 bg-purple-500/10',
    desc: 'Architect high-performance OOP software structures, customized template classes, and embedded-optimized collections.',
    syllabus: [
      { week: 1, title: 'Object-Oriented Encapsulation', details: 'Classes, Objects, Members, and Access Specifiers' },
      { week: 2, title: 'Inheritance & Polymorphism', details: 'Base/Derived classes, Virtual Functions, and VTables' },
      { week: 3, title: 'Generic Programming', details: 'Function/Class templates, and Standard Template Library (STL) overrides' },
      { week: 4, title: 'Embedded Space Optimization', details: 'No-overhead allocations, inline functions, and lightweight classes' }
    ]
  },
  {
    id: 'IoT',
    title: 'IoT & Smart Interfacing Solutions',
    difficulty: 'Intermediate to Advanced',
    tags: ['Microcontrollers', 'Cloud Services'],
    color: 'from-green-500/20 via-green-600/10 to-transparent border-green-500/30',
    iconColor: 'text-green-400 bg-green-500/10',
    desc: 'Connect physical systems with ESP microcontrollers, ADCs, custom serial buses, MQTT client protocols, and remote cloud metrics.',
    syllabus: [
      { week: 1, title: 'IoT Microcontroller Baselines', details: 'ESP Core architecture, pinouts, and hardware development setups' },
      { week: 2, title: 'Hardware Interfacing', details: 'ADCs, DACs, I2C, SPI, and UART serial communication' },
      { week: 3, title: 'Connectivity Protocols', details: 'WiFi configurations, MQTT Clients, publish/subscribe payloads' },
      { week: 4, title: 'Cloud Dashboards & Alerts', details: 'Real-time telemetry, remote actuator control, and cloud hooks' }
    ]
  },
  {
    id: 'Embedded',
    title: 'Embedded Systems & Real-Time OS',
    difficulty: 'Advanced',
    tags: ['RTOS Kernels', 'Hardware Interrupts'],
    color: 'from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30',
    iconColor: 'text-orange-400 bg-orange-500/10',
    desc: 'Implement low-level peripheral drivers, nested vectored interrupts, RTOS task scheduling, semaphores, and power configurations.',
    syllabus: [
      { week: 1, title: 'Peripheral Driver Baselines', details: 'GPIO register manipulation, clock gating, and abstract HALs' },
      { week: 2, title: 'Interrupt Handlers & PWM', details: 'Timer hardware interrupts, nested interrupt priorities, and PWM control' },
      { week: 3, title: 'RTOS Task Management', details: 'Preemptive scheduler, task priorities, queues, and mutexes' },
      { week: 4, title: 'System Diagnostics & Safety', details: 'Watchdog timers, brown-out detectors, and ultra-low power modes' }
    ]
  }
];

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

  // Accordion active week syllabus previews
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  
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
    <div className="space-y-24 py-12 px-4 max-w-7xl mx-auto">
      
      {/* 1. Hero & Branding Introduction Block */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[65vh]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-black uppercase tracking-wider shadow-sm">
            <ShieldCheck size={14} /> ISO 9001:2015 Accredited Portal
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white">
            Nexus Academic & <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-md">
              Embedded Innovation
            </span>
          </h1>
          
          <p className="text-slate-350 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            Access specialized industrial training curriculums covering low-level C programming, object-oriented software design, IoT controller networks, and real-time RTOS microkernels.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
            <button 
              onClick={scrollToEnroll}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all transform active:scale-95 shadow-lg shadow-amber-500/10"
            >
              Start Learning Now
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Browse Curriculum
            </button>
          </div>
        </motion.div>

        {/* Hero Decorative Illustration card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex-1 w-full max-w-md relative select-none hidden lg:block"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-950/60 border border-slate-850 shadow-2xl relative overflow-hidden flex flex-col gap-6 text-center">
            {/* Ambient gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>

            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <GraduationCap size={32} />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Industrial Training Registry</h3>
              <p className="text-slate-450 text-xs font-semibold uppercase tracking-widest">Accredited by Nexus Labs</p>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 text-[10px] text-slate-400 leading-relaxed font-mono uppercase tracking-tight space-y-1">
              <p className="text-amber-500 font-bold">✔ 100% Verified Credentials</p>
              <p>✔ Realtime Database Security</p>
              <p>✔ Comprehensive Syllabus Accordions</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. Trust Metrics / Social Proof Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-slate-850 py-8">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-amber-500 tracking-tight sm:text-4xl">1,250+</h2>
          <p className="text-slate-450 text-xs font-black uppercase tracking-widest">Accredited Students</p>
        </div>
        <div className="text-center space-y-1 border-y sm:border-y-0 sm:border-x border-slate-850 py-4 sm:py-0">
          <h2 className="text-3xl font-black text-amber-500 tracking-tight sm:text-4xl">4 Tracks</h2>
          <p className="text-slate-450 text-xs font-black uppercase tracking-widest">Specialized Courses</p>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-amber-500 tracking-tight sm:text-4xl">100%</h2>
          <p className="text-slate-450 text-xs font-black uppercase tracking-widest">Free & Verifiable</p>
        </div>
      </div>

      {/* 3. Interactive Course Catalog Section */}
      <div id="catalog-section" className="space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase">Accredited Course Catalog</h2>
          <p className="text-slate-450 text-sm font-medium leading-relaxed">
            Expand our specialized weekly modules. Click the Syllabus accordion on any track to preview what you will learn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courseDetails.map((course) => {
            const isExpanded = expandedCourse === course.id;

            return (
              <div 
                key={course.id}
                className={`bg-slate-900/30 border rounded-2xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:border-slate-700/80 shadow-lg ${
                  isExpanded ? 'border-amber-500/20 shadow-amber-500/5' : 'border-slate-850'
                }`}
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${course.color} rounded-full blur-3xl pointer-events-none`}></div>
                
                <div className="space-y-4">
                  {/* Top tags row */}
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                      Free to Learn
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      ⚡ {course.difficulty}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-white tracking-tight">{course.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{course.desc}</p>
                  </div>

                  {/* Expandable Accordion Syllabus Trigger */}
                  <div className="pt-2">
                    <button 
                      onClick={() => toggleSyllabus(course.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                        isExpanded 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                          : 'bg-slate-950/40 border-slate-900 text-slate-350 hover:bg-slate-900/60 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 uppercase tracking-wider">
                        <BookOpen size={14} /> {isExpanded ? "Hide Syllabus Details" : "View Syllabus Details"}
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* Expandable Content (Weekly Syllabus) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden mt-3.5 space-y-3.5 pl-1.5"
                        >
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-1.5 pl-0.5">Syllabus Breakdown</h4>
                          <div className="space-y-3">
                            {course.syllabus.map((syll) => (
                              <div key={syll.week} className="flex gap-3 text-left">
                                <span className="text-[10px] font-black text-amber-400 shrink-0 bg-amber-500/10 h-5 w-9 flex items-center justify-center rounded border border-amber-500/20">
                                  W{syll.week}
                                </span>
                                <div>
                                  <p className="text-xs font-bold text-white leading-tight">{syll.title}</p>
                                  <p className="text-[10px] text-slate-450 mt-0.5 font-medium leading-relaxed">{syll.details}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-850/60 flex justify-end">
                  <button 
                    onClick={scrollToEnroll}
                    className="text-xs font-extrabold uppercase text-amber-450 hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    Start Learning →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Value Propositions / Credibility Accreditations */}
      <div className="space-y-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-center text-slate-450 border-b border-slate-850 pb-4">Accreditation & Quality Standards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-slate-900/20 border border-slate-850 rounded-xl space-y-2">
            <CheckCircle2 className="text-amber-500" size={24} />
            <h4 className="text-sm font-bold text-white tracking-tight uppercase">ISO Certified</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Complies with ISO 9001:2015 & ISO/IEC 27001 secure operation baselines.
            </p>
          </div>
          
          <div className="p-5 bg-slate-900/20 border border-slate-850 rounded-xl space-y-2">
            <CheckCircle2 className="text-amber-500" size={24} />
            <h4 className="text-sm font-bold text-white tracking-tight uppercase">Secure Verification</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Each student gets a unique scannable QR Code and verifiable Registry ID.
            </p>
          </div>

          <div className="p-5 bg-slate-900/20 border border-slate-850 rounded-xl space-y-2">
            <CheckCircle2 className="text-amber-500" size={24} />
            <h4 className="text-sm font-bold text-white tracking-tight uppercase">Hands-on Labs</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Learn dynamically with real codes, timing maps, and ESP microcontroller drivers.
            </p>
          </div>

          <div className="p-5 bg-slate-900/20 border border-slate-850 rounded-xl space-y-2">
            <CheckCircle2 className="text-amber-500" size={24} />
            <h4 className="text-sm font-bold text-white tracking-tight uppercase">100% Free Access</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              No enrollment fees or payments for learning curriculum.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Enrollment Portal (Login/Register Form Section) */}
      <div id="enrollment-section" className="flex justify-center pt-8 border-t border-slate-850">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="relative bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
            
            {/* Decorative glowing gradient sphere */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-white to-slate-350 bg-clip-text text-transparent uppercase">
              {isLogin ? 'Student Login' : 'Registration'}
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
                      <User className="absolute left-3 top-3 text-slate-455" size={18} />
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
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 text-white placeholder-slate-455 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm" 
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
                className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 text-slate-950 shadow-lg shadow-amber-500/10 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none text-sm uppercase tracking-wider"
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

    </div>
  );
};

export default Home;
