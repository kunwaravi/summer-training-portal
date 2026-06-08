import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { 
  LogIn, UserPlus, Mail, Lock, User, GraduationCap, 
  ShieldCheck, CheckCircle2, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';
import CourseCard from '../components/molecules/CourseCard';
import Card from '../components/atoms/Card';

const courseDetails = [
  {
    id: 'C',
    title: 'C & Systems Programming',
    difficulty: 'Beginner to Intermediate',
    tags: ['Core Electronics', 'Hardware Mapping'],
    color: 'from-blue-500/20 via-blue-600/10 to-transparent border-blue-500/30',
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

  const { login } = useAuth();
  const { addToast } = useUI();
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
      addToast(isLogin ? 'Successfully logged in!' : 'Successfully registered!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Invalid credentials or connection error';
      setError(errMsg);
      addToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToEnroll = () => {
    const el = document.getElementById('enrollment-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 py-12 px-4 max-w-7xl mx-auto">
      
      {/* Desktop Optimization Notice Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3 text-left">
        <span className="text-xl">💻</span>
        <div className="text-xs sm:text-sm text-slate-350">
          <strong className="text-blue-400 block sm:inline mr-1">Desktop Recommended:</strong>
          For the best experience, including interactive code sandboxes and high-resolution certificate printing, we recommend using a Desktop or Laptop browser.
        </div>
      </div>
      
      {/* 1. Hero & Branding Introduction Block */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[65vh]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-black uppercase tracking-wider shadow-sm">
            <ShieldCheck size={14} /> Live Verifiable Training Portal
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white">
            Nexus Academic & <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-md">
              Embedded Innovation
            </span>
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            Access specialized industrial training curriculums covering low-level C programming, object-oriented software design, IoT controller networks, and real-time RTOS microkernels.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
            {/* Telegram Group Button */}
            <a
              href="https://t.me/+tCapxtLwxNNlZjY1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/40 hover:border-[#229ED9]/70 text-[#29aae2] font-extrabold text-xs uppercase tracking-widest transition-all duration-200 shadow-sm hover:shadow-[0_0_16px_rgba(34,158,217,0.2)] group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform duration-200">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.09 14.4l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.726.186z"/>
              </svg>
              Join Telegram Group
            </a>
            <Button 
              variant="accent"
              onClick={scrollToEnroll}
            >
              Start Learning Now
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Browse Curriculum
            </Button>
          </div>
        </motion.div>

        {/* Hero Decorative Illustration card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex-1 w-full max-w-md relative select-none hidden lg:block"
        >
          <Card className="p-8 text-center" variant="glass">
            {/* Ambient gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>

            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
              <GraduationCap size={32} />
            </div>
            
            <div className="space-y-1 mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Industrial Training Registry</h3>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Accredited by Nexus Labs</p>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 text-[10px] text-slate-400 leading-relaxed font-mono uppercase tracking-tight space-y-1">
              <p className="text-amber-500 font-bold">✔ 100% Verified Credentials</p>
              <p>✔ Realtime Database Security</p>
              <p>✔ Comprehensive Syllabus Accordions</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 2. Trust Metrics / Social Proof Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-slate-800 py-8">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-amber-500 tracking-tight sm:text-4xl">1,250+</h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Accredited Students</p>
        </div>
        <div className="text-center space-y-1 border-y sm:border-y-0 sm:border-x border-slate-800 py-4 sm:py-0">
          <h2 className="text-3xl font-black text-amber-500 tracking-tight sm:text-4xl">4 Tracks</h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Specialized Courses</p>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-amber-500 tracking-tight sm:text-4xl">100%</h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Free & Verifiable</p>
        </div>
      </div>

      {/* 3. Interactive Course Catalog Section */}
      <div id="catalog-section" className="space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase">Accredited Course Catalog</h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Explore our specialized 20-chapter curriculum. Click the Syllabus accordion on any track to preview what you will learn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courseDetails.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              type="catalog"
              onAction={scrollToEnroll}
            />
          ))}
        </div>
      </div>

      {/* 4. Value Propositions / Credibility Accreditations */}
      <div className="space-y-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-center text-slate-500 border-b border-slate-800 pb-4">Accreditation & Quality Standards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Verifiable Registry', desc: 'Secure database verification system with unique tracking IDs.' },
            { title: 'Secure Verification', desc: 'Each student gets a unique scannable QR Code and verifiable Registry ID.' },
            { title: 'Hands-on Labs', desc: 'Learn dynamically with real codes, timing maps, and ESP microcontroller drivers.' },
            { title: '100% Free Access', desc: 'No enrollment fees or payments for learning curriculum.' }
          ].map((val, i) => (
            <Card key={i} className="p-5 space-y-2">
              <CheckCircle2 className="text-amber-500" size={24} />
              <h4 className="text-sm font-bold text-white tracking-tight uppercase">{val.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{val.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. Enrollment Portal (Login/Register Form Section) */}
      <div id="enrollment-section" className="flex justify-center pt-8 border-t border-slate-800">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 relative overflow-hidden" variant="glass">
            
            {/* Decorative glowing gradient sphere */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">
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
                    <FormField
                      label="Full Name"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      leftIcon={<User size={18} />}
                      required
                    />
                    <FormField
                      label="Father's Name"
                      placeholder="Father's Name"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      leftIcon={<User size={18} />}
                      required
                    />
                    <FormField
                      label="College Name"
                      placeholder="College Name"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      leftIcon={<GraduationCap size={18} />}
                      required
                    />
                    <FormField
                      label="Branch"
                      placeholder="Branch (e.g. ECE, EEE, CSE)"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      leftIcon={<GraduationCap size={18} />}
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <FormField
                label="Email Address"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
                required
              />
              
              <FormField
                label="Password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={18} />}
                required
                error={error}
              />
              
              <Button 
                type="submit"
                isLoading={isLoading}
                variant="accent"
                fullWidth
                className="mt-4"
                leftIcon={isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
              >
                {isLogin ? 'Login' : 'Enroll Now'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-slate-400 text-sm">
              {isLogin ? "New to the portal?" : "Already enrolled?"}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                className="ml-2 text-amber-500 hover:underline font-semibold"
              >
                {isLogin ? 'Create Account' : 'Login Here'}
              </button>
            </div>
          </Card>

          {/* Prominent Technical Support Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-center bg-slate-900/40 border border-slate-900/60 rounded-2xl p-4 max-w-md mx-auto"
          >
            <p className="text-xs text-slate-400 font-medium">
              Having trouble? Need help with activation?
            </p>
            <div className="flex justify-center items-center gap-6 mt-3">
              <a 
                href="mailto:support@edunexus.in" 
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider transition-colors"
              >
                <Mail size={14} /> support@edunexus.in
              </a>
              <span className="text-slate-800">•</span>
              <a 
                href="https://t.me/+tCapxtLwxNNlZjY1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider transition-colors"
              >
                <Send size={14} /> Telegram Help
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
};

export default Home;
