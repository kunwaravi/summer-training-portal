import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { 
  LogIn, UserPlus, Mail, Lock, User, GraduationCap, 
  ShieldCheck, CheckCircle2, Send, MessageSquare, BookOpen, 
  Cpu, Code2, Server, Wifi, Terminal, Database, 
  Trophy, ArrowRight, Zap, Sparkles,
  ChevronDown, ChevronUp, Wrench, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';
import Card from '../components/atoms/Card';

const courseDetails = [
  {
    id: 'C',
    title: 'C & Systems Programming',
    difficulty: 'Beginner to Intermediate',
    tags: ['Core Electronics', 'Hardware Mapping'],
    color: 'from-blue-500/20 via-blue-600/10 to-transparent border-blue-500/30',
    icon: Code2,
    colSpan: 'md:col-span-3',
    desc: 'Master procedural programming, binary systems, hardware mapping, memory allocations, and register compilations.',
    syllabus: [
      { week: 1, title: 'Procedural Fundamentals', details: 'Variables, Data Types, Control Flows, and Memory Layouts', milestone: 'Program execution flow diagram' },
      { week: 2, title: 'Modular Architecture', details: 'Functions, Scopes, Arrays, and Pointer Arithmetic', milestone: 'Function stack visual map' },
      { week: 3, title: 'Structures & I/O Systems', details: 'Dynamic Memory Allocation, Structs, and Hardware File I/O', milestone: 'Custom heap allocator simulator' },
      { week: 4, title: 'Low-Level Register Macros', details: 'Compilation pipelines, Register keywords, and direct hardware macros', milestone: 'Virtual peripheral registers setup' }
    ]
  },
  {
    id: 'C++',
    title: 'C++ & OOP for Embedded Systems',
    difficulty: 'Intermediate',
    tags: ['Object-Oriented', 'High Performance'],
    color: 'from-purple-500/20 via-purple-600/10 to-transparent border-purple-500/30',
    icon: Cpu,
    colSpan: 'md:col-span-3',
    desc: 'Architect high-performance OOP software structures, customized template classes, and embedded-optimized collections.',
    syllabus: [
      { week: 1, title: 'Object-Oriented Encapsulation', details: 'Classes, Objects, Members, and Access Specifiers', milestone: 'RAII Smart Lock instance' },
      { week: 2, title: 'Inheritance & Polymorphism', details: 'Base/Derived classes, Virtual Functions, and VTables', milestone: 'VTable dispatch table mockup' },
      { week: 3, title: 'Generic Programming', details: 'Function/Class templates, and Standard Template Library (STL) overrides', milestone: 'Vector class allocator override' },
      { week: 4, title: 'Embedded Space Optimization', details: 'No-overhead allocations, inline functions, and lightweight classes', milestone: 'Zero-overhead custom ring buffer' }
    ]
  },
  {
    id: 'IoT',
    title: 'IoT & Smart Interfacing Solutions',
    difficulty: 'Intermediate to Advanced',
    tags: ['Microcontrollers', 'Cloud Services'],
    color: 'from-teal-500/20 via-teal-600/10 to-transparent border-teal-500/30',
    icon: Wifi,
    colSpan: 'md:col-span-2',
    desc: 'Connect physical systems with ESP microcontrollers, ADCs, custom serial buses, MQTT client protocols, and remote cloud metrics.',
    syllabus: [
      { week: 1, title: 'IoT Microcontroller Baselines', details: 'ESP Core architecture, pinouts, and hardware development setups', milestone: 'ESP32 development workspace setup' },
      { week: 2, title: 'Hardware Interfacing', details: 'ADCs, DACs, I2C, SPI, and UART serial communication', milestone: 'Serial protocols logic mapping' },
      { week: 3, title: 'Connectivity Protocols', details: 'WiFi configurations, MQTT Clients, publish/subscribe payloads', milestone: 'Publish MQTT payload mock' },
      { week: 4, title: 'Cloud Dashboards & Alerts', details: 'Real-time telemetry, remote actuator control, and cloud hooks', milestone: 'Realtime line charts telemetry' }
    ]
  },
  {
    id: 'Embedded',
    title: 'Embedded Systems & Real-Time OS',
    difficulty: 'Advanced',
    tags: ['RTOS Kernels', 'Hardware Interrupts'],
    color: 'from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30',
    icon: Server,
    colSpan: 'md:col-span-4',
    desc: 'Implement low-level peripheral drivers, nested vectored interrupts, RTOS task scheduling, semaphores, and power configurations.',
    syllabus: [
      { week: 1, title: 'Peripheral Driver Baselines', details: 'GPIO register manipulation, clock gating, and writing abstract HALs', milestone: 'Visual Cortex-M Startup vector table' },
      { week: 2, title: 'Interrupt Handlers & PWM', details: 'Timer hardware interrupts, nested interrupt priorities, and PWM control', milestone: 'GPIO physical register map tool' },
      { week: 3, title: 'RTOS Task Management', details: 'Preemptive scheduler, task priorities, queues, and mutexes', milestone: 'NVIC priority visualizer' },
      { week: 4, title: 'System Diagnostics & Safety', details: 'Watchdog timers, brown-out detectors, and ultra-low power modes', milestone: 'Realtime task context switcher schematic' }
    ]
  },
  {
    id: 'WebDesign',
    title: 'Web Design & Frontend Development',
    difficulty: 'Beginner',
    tags: ['HTML/CSS', 'Responsive Layouts'],
    color: 'from-pink-500/20 via-pink-600/10 to-transparent border-pink-500/30',
    icon: Terminal,
    colSpan: 'md:col-span-2',
    desc: 'Learn HTML, CSS, JavaScript, and modern responsive design patterns in Hinglish.',
    syllabus: [
      { week: 1, title: 'HTML5 & Semantic Structure', details: 'Web page basics, layout structure, and HTML5 semantic markup', milestone: 'Semantic page layout mockup' },
      { week: 2, title: 'CSS3 Styling & Responsive Design', details: 'Colors, Flexbox layouts, media queries, and Tailwind CSS baselines', milestone: 'Flexbox layout portfolio setup' },
      { week: 3, title: 'JavaScript & DOM Manipulation', details: 'Variables, loops, DOM events, and adding interactive page elements', milestone: 'Form validator logic handler' },
      { week: 4, title: 'Web Hosting & Git Deploy', details: 'Building a portfolio website, version control, and deploying live to hosting', milestone: 'Deploy live page to Vercel/Netlify' }
    ]
  },
  {
    id: 'Python',
    title: 'Python Programming & Scripting',
    difficulty: 'Beginner to Intermediate',
    tags: ['Data Analysis', 'Automation Scripting'],
    color: 'from-amber-500/20 via-amber-600/10 to-transparent border-amber-500/30',
    icon: Terminal,
    colSpan: 'md:col-span-2',
    desc: 'Master Python syntax, data analysis, automation scripts, and file structures in Hinglish.',
    syllabus: [
      { week: 1, title: 'Python Syntax & Logic', details: 'Variables, loops, conditionals, and standard console inputs/outputs', milestone: 'Basic calculator script' },
      { week: 2, title: 'Data Structures & Functions', details: 'Lists, tuples, dictionaries, and modular reusable functions', milestone: 'File sorting dictionary utility' },
      { week: 3, title: 'File IO & OOP in Python', details: 'Reading/writing files, handling exceptions, and object-oriented class syntax', milestone: 'Employee payroll class schema' },
      { week: 4, title: 'Data Libraries & Analytics', details: 'Pandas dataframes, Matplotlib plotting, and scripting web scrapers', milestone: 'Custom chart plotter for CSV data' }
    ]
  },
  {
    id: 'SQL',
    title: 'Database Management & SQL',
    difficulty: 'Beginner to Intermediate',
    tags: ['Relational DB', 'Query Optimizations'],
    color: 'from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-500/30',
    icon: Database,
    colSpan: 'md:col-span-2',
    desc: 'Learn relational databases, SQL queries, joins, indexes, and schema design in Hinglish.',
    syllabus: [
      { week: 1, title: 'Database Baselines & DDL', details: 'Relational DB concepts, table creations, primary keys, and data definitions', milestone: 'Filtered student report cards query' },
      { week: 2, title: 'SQL Queries & Joins', details: 'Filtering, SELECT statements, inner/outer joins, and subquery nestings', milestone: 'Multi-table inventory mapping' },
      { week: 3, title: 'ACID Transactions & Views', details: 'Data alterations (DML), index speeds, views, and commit/rollback logic', milestone: 'Safe bank account transfer script' },
      { week: 4, title: 'SQL Application Interfacing', details: 'Connecting DB to backend services, schema designs, and indexing queries', milestone: 'Index speed validation script' }
    ]
  },
  {
    id: 'CADDED_Mech',
    title: 'CADDED Software (Mechanical)',
    difficulty: 'Beginner to Intermediate',
    tags: ['AutoCAD 2D', 'SolidWorks', 'CATIA Surfaces', 'CNC G-Code'],
    color: 'from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30',
    icon: Wrench,
    colSpan: 'md:col-span-3',
    desc: 'Master mechanical systems engineering with AutoCAD 2D drafts, SolidWorks parts modeling, CATIA surfacing, and CNC G-code toolpath programming.',
    syllabus: [
      { week: 1, title: 'AutoCAD 2D & Interface', details: 'Coordinate systems, basic drafting tools, layers, and dimensions', milestone: 'Flange 2D drafting layout' },
      { week: 2, title: 'SolidWorks Part Modeling', details: 'Parametric modeling, sketches, relations, extrude, and revolve', milestone: 'Hinge bracket 3D part design' },
      { week: 3, title: 'CATIA Shape Design', details: 'Generative shape design, sweeps, lofts, joins, and spline curves', milestone: 'Turbine aerofoil surface sweep' },
      { week: 4, title: 'CNC Code & Project Work', details: 'CNC G-code & M-code toolpaths programming and assembly constraints', milestone: 'Pocket milling G-code & Piston assembly' }
    ]
  },
  {
    id: 'CADDED_Civil',
    title: 'CADDED Software (Civil/Architecture)',
    difficulty: 'Beginner to Intermediate',
    tags: ['AutoCAD Civil', '3DS Max Render', 'SketchUp', 'Revit BIM'],
    color: 'from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-500/30',
    icon: Building2,
    colSpan: 'md:col-span-3',
    desc: 'Master civil site plans in AutoCAD Civil, 3DS Max architectural renders, Google SketchUp layouts, and Revit BIM structural grid designs.',
    syllabus: [
      { week: 1, title: 'AutoCAD Civil Site Plans', details: 'Drafting floor plans, sections, elevations, and municipal standards', milestone: '2BHK residential plan layout' },
      { week: 2, title: '3DS Max Render & SketchUp', details: 'V-Ray rendering, material mapping, camera views, and rapid SketchUp models', milestone: 'Villa exterior rendering & kitchen layout' },
      { week: 3, title: 'Revit Structural Analysis', details: 'Slabs, foundations, columns, beams grid alignment, and concrete reinforcement', milestone: 'Beam-Column junction steel detail' },
      { week: 4, title: 'Revit BIM & Project Work', details: 'BIM walls/roofs families, window schedules, documentation viewports sheets', milestone: 'G+3 building BIM portfolio sheets' }
    ]
  }
];

const courseMetadata: Record<string, any> = {
  'C': {
    difficulty: 'Beginner to Intermediate',
    tags: ['Core Electronics', 'Hardware Mapping'],
    color: 'from-blue-500/20 via-blue-600/10 to-transparent border-blue-500/30',
    icon: Code2,
    colSpan: 'md:col-span-3',
    milestones: {
      1: 'Program execution flow diagram',
      2: 'Function stack visual map',
      3: 'Custom heap allocator simulator',
      4: 'Virtual peripheral registers setup'
    }
  },
  'C++': {
    difficulty: 'Intermediate',
    tags: ['Object-Oriented', 'High Performance'],
    color: 'from-purple-500/20 via-purple-600/10 to-transparent border-purple-500/30',
    icon: Cpu,
    colSpan: 'md:col-span-3',
    milestones: {
      1: 'RAII Smart Lock instance',
      2: 'VTable dispatch table mockup',
      3: 'Vector class allocator override',
      4: 'Zero-overhead custom ring buffer'
    }
  },
  'IoT': {
    difficulty: 'Intermediate to Advanced',
    tags: ['Microcontrollers', 'Cloud Services'],
    color: 'from-teal-500/20 via-teal-600/10 to-transparent border-teal-500/30',
    icon: Wifi,
    colSpan: 'md:col-span-2',
    milestones: {
      1: 'ESP32 development workspace setup',
      2: 'Serial protocols logic mapping',
      3: 'Publish MQTT payload mock',
      4: 'Realtime line charts telemetry'
    }
  },
  'Embedded': {
    difficulty: 'Advanced',
    tags: ['RTOS Kernels', 'Hardware Interrupts'],
    color: 'from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30',
    icon: Server,
    colSpan: 'md:col-span-4',
    milestones: {
      1: 'Visual Cortex-M Startup vector table',
      2: 'GPIO physical register map tool',
      3: 'NVIC priority visualizer',
      4: 'Realtime task context switcher schematic'
    }
  },
  'WebDesign': {
    difficulty: 'Beginner',
    tags: ['HTML/CSS', 'Responsive Layouts'],
    color: 'from-pink-500/20 via-pink-600/10 to-transparent border-pink-500/30',
    icon: Terminal,
    colSpan: 'md:col-span-2',
    milestones: {
      1: 'Semantic page layout mockup',
      2: 'Flexbox layout portfolio setup',
      3: 'Form validator logic handler',
      4: 'Deploy live page to Vercel/Netlify'
    }
  },
  'Python': {
    difficulty: 'Beginner to Intermediate',
    tags: ['Data Analysis', 'Automation Scripting'],
    color: 'from-amber-500/20 via-amber-600/10 to-transparent border-amber-500/30',
    icon: Terminal,
    colSpan: 'md:col-span-2',
    milestones: {
      1: 'Basic calculator script',
      2: 'File sorting dictionary utility',
      3: 'Employee payroll class schema',
      4: 'Custom chart plotter for CSV data'
    }
  },
  'SQL': {
    difficulty: 'Beginner to Intermediate',
    tags: ['Relational DB', 'Query Optimizations'],
    color: 'from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-500/30',
    icon: Database,
    colSpan: 'md:col-span-2',
    milestones: {
      1: 'Filtered student report cards query',
      2: 'Multi-table inventory mapping',
      3: 'Safe bank account transfer script',
      4: 'Index speed validation script'
    }
  },
  'CADDED_Mech': {
    difficulty: 'Beginner to Intermediate',
    tags: ['AutoCAD 2D', 'SolidWorks', 'CATIA Surfaces', 'CNC G-Code'],
    color: 'from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30',
    icon: Wrench,
    colSpan: 'md:col-span-3',
    milestones: {
      1: 'Flange 2D drafting layout',
      2: 'Hinge bracket 3D part design',
      3: 'Turbine aerofoil surface sweep',
      4: 'Pocket milling G-code & Piston assembly'
    }
  },
  'CADDED_Civil': {
    difficulty: 'Beginner to Intermediate',
    tags: ['AutoCAD Civil', '3DS Max Render', 'SketchUp', 'Revit BIM'],
    color: 'from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-500/30',
    icon: Building2,
    colSpan: 'md:col-span-3',
    milestones: {
      1: '2BHK residential plan layout',
      2: 'Villa exterior rendering & kitchen layout',
      3: 'Beam-Column junction steel detail',
      4: 'G+3 building BIM portfolio sheets'
    }
  }
};

const ResistorIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 32h10l4-12 6 24 6-24 6 24 6-24 4 12h18" />
    <rect x="20" y="24" width="24" height="16" rx="2" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="2" />
    <line x1="26" y1="24" x2="26" y2="40" />
    <line x1="32" y1="24" x2="32" y2="40" />
    <line x1="38" y1="24" x2="38" y2="40" />
  </svg>
);

const AndGateIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 16h16c8 0 16 6 16 16s-8 16-16 16H16V16z" />
    <line x1="4" y1="24" x2="16" y2="24" />
    <line x1="4" y1="40" x2="16" y2="40" />
    <line x1="48" y1="32" x2="60" y2="32" />
  </svg>
);

const CapacitorIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="32" y1="4" x2="32" y2="26" />
    <line x1="32" y1="38" x2="32" y2="60" />
    <line x1="16" y1="26" x2="48" y2="26" strokeWidth="3" />
    <line x1="16" y1="38" x2="48" y2="38" strokeWidth="3" />
  </svg>
);

const getGlowStyles = (id: string) => {
  switch (id) {
    case 'C': return 'hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]';
    case 'C++': return 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]';
    case 'IoT': return 'hover:border-teal-500/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]';
    case 'Embedded': return 'hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]';
    case 'WebDesign': return 'hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]';
    case 'Python': return 'hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]';
    case 'SQL': return 'hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]';
    case 'CADDED_Mech': return 'hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]';
    case 'CADDED_Civil': return 'hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]';
    default: return 'hover:border-slate-700/80';
  }
};

// Floating Tech Background Icons
const FloatingTechIcons = () => {
  const icons = [
    { Icon: Cpu, color: 'text-blue-500/20', size: 40, x: '8%', y: '12%', delay: 0 },
    { Icon: ResistorIcon, color: 'text-amber-500/20', size: 44, x: '82%', y: '18%', delay: 1 },
    { Icon: Server, color: 'text-purple-500/20', size: 44, x: '72%', y: '78%', delay: 2 },
    { Icon: AndGateIcon, color: 'text-teal-500/20', size: 40, x: '18%', y: '82%', delay: 1.5 },
    { Icon: CapacitorIcon, color: 'text-pink-500/20', size: 36, x: '5%', y: '48%', delay: 0.5 },
    { Icon: Database, color: 'text-emerald-500/20', size: 42, x: '88%', y: '52%', delay: 2.5 },
    { Icon: Code2, color: 'text-indigo-500/20', size: 36, x: '42%', y: '88%', delay: 3 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {icons.map((item, idx) => {
        const IconComponent = item.Icon;
        return (
          <motion.div
            key={idx}
            style={{ position: 'absolute', left: item.x, top: item.y }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15 + idx * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
            className={`${item.color}`}
          >
            <IconComponent size={item.size} />
          </motion.div>
        );
      })}
    </div>
  );
};

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [previewCourse, setPreviewCourse] = useState<any | null>(null);
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [activeWeekPreview, setActiveWeekPreview] = useState<number>(1);
  const [showAllLeaderboard, setShowAllLeaderboard] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  const { login } = useAuth();
  const { addToast } = useUI();
  const navigate = useNavigate();

  // Fetch courses from backend API
  useEffect(() => {
    api.get('/courses')
      .then(res => {
        setCourses(res.data);
      })
      .catch(err => {
        console.error('Failed to load courses from API:', err);
      });
  }, []);

  const mappedCourses = courses.map((c: any) => {
    const meta = courseMetadata[c.id] || {
      difficulty: 'Beginner to Intermediate',
      tags: ['Specialized Program'],
      color: 'from-slate-700/20 via-slate-800/10 to-transparent border-slate-750/30',
      icon: BookOpen,
      colSpan: 'md:col-span-2',
      milestones: {}
    };
    
    return {
      id: c.id,
      title: c.title,
      difficulty: meta.difficulty,
      tags: meta.tags,
      color: meta.color,
      icon: meta.icon,
      colSpan: meta.colSpan,
      desc: c.description || 'Welcome to this specialized curriculum track.',
      syllabus: (c.modules || []).map((m: any) => ({
        week: m.week,
        title: m.title,
        details: m.description || 'Curriculum details for this week.',
        milestone: meta.milestones?.[m.week] || 'Weekly hands-on lab project'
      }))
    };
  });

  const coursesList = courses.length > 0 ? mappedCourses : courseDetails;

  // Scroll Progress Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Public Leaderboard / Hall of Fame
  useEffect(() => {
    api.get('/practice/leaderboard/public')
      .then(res => {
        setTopStudents(res.data.leaderboard || []);
      })
      .catch(err => {
        console.error('Failed to load public leaderboard, using fallback mock data:', err);
        // Fallback mock students if DB is empty or call fails
        setTopStudents([
          { name: 'Rohan Deshmukh', points: 640, badges: ['week_1_master', 'perfect_score'], collegeName: 'COEP Technological University' },
          { name: 'Simran Preet Kaur', points: 520, badges: ['bug_hunter', 'perfect_score'], collegeName: 'Thapar Institute' },
          { name: 'Aditya Narang', points: 490, badges: ['week_1_master'], collegeName: 'BITS Pilani' },
          { name: 'Gauri Shinde', points: 410, badges: ['bug_hunter'], collegeName: 'Vellore Institute of Technology' },
          { name: 'Vivek Joshi', points: 380, badges: ['perfect_score'], collegeName: 'Delhi Technological University' }
        ]);
      });
  }, []);

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
    <div className="space-y-16 py-12 px-4 max-w-7xl mx-auto relative">
      
      {/* Sleek Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-amber-500 z-50 origin-left"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
        <motion.div
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 50, 0],
            y: [0, 40, -40, 0],
            scale: [1, 0.9, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, 30, -30, 0],
            scale: [1, 1.1, 0.85, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[40%] left-[20%] w-[45%] h-[45%] rounded-full bg-purple-600/8 blur-[110px]"
        />
      </div>

      {/* Floating Background Icons */}
      <FloatingTechIcons />

      {/* Desktop Optimization Notice Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3 text-left backdrop-blur-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"></div>
        <span className="text-xl">💻</span>
        <div className="text-xs sm:text-sm text-slate-300">
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
          className="flex-1 text-center lg:text-left space-y-6 z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-black uppercase tracking-wider shadow-sm backdrop-blur-md">
            <ShieldCheck size={14} className="animate-pulse" /> Live Verifiable Training Portal
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
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/45 hover:border-[#229ED9]/70 text-[#29aae2] font-extrabold text-xs uppercase tracking-widest transition-all duration-200 shadow-sm hover:shadow-[0_0_16px_rgba(34,158,217,0.2)] group"
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

        {/* Hero Decorative Illustration card with Mesh Gradient and Floating Items */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex-1 w-full max-w-md relative select-none hidden lg:block"
        >
          {/* Animated Mesh Gradient Wrapper */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-amber-500/5 to-purple-500/10 rounded-2xl blur-xl animate-pulse"></div>

          <Card className="p-8 text-center relative overflow-hidden border border-slate-800" variant="glass">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>

            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 relative group">
              <Sparkles size={28} className="absolute animate-spin-slow opacity-30 text-amber-300" />
              <GraduationCap size={32} className="relative z-10" />
            </div>
            
            <div className="space-y-1 mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Industrial Training Registry</h3>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Accredited by Nexus Labs</p>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 text-[10.5px] text-slate-400 leading-relaxed font-mono uppercase tracking-tight space-y-2 text-left">
              <p className="text-amber-500 font-extrabold flex items-center gap-1.5"><CheckCircle2 size={13} /> 100% Verified Credentials</p>
              <p className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Realtime Database Security</p>
              <p className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Interactive Circuit Simulators</p>
              <p className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Self-Paced Sandbox Arenas</p>
            </div>
          </Card>
        </motion.div>
      </div>

    {/* Animated Scroll Indicator */}
    <div className="flex justify-center pb-4">
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="text-slate-500 hover:text-amber-400 transition-colors cursor-pointer flex flex-col items-center gap-1.5"
        onClick={() => {
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Explore Catalog</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-amber-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7" />
        </svg>
      </motion.div>
    </div>

      {/* 2. Trust Metrics / Social Proof Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-slate-800/80 py-8 relative">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-amber-500 tracking-tight sm:text-4xl">1,250+</h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Accredited Students</p>
        </div>
        <div className="text-center space-y-1 border-y sm:border-y-0 sm:border-x border-slate-800/80 py-4 sm:py-0">
          <h2 className="text-3xl font-black text-amber-500 tracking-tight sm:text-4xl">9 Tracks</h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Specialized Courses</p>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-amber-500 tracking-tight sm:text-4xl">100%</h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Free & Verifiable</p>
        </div>
      </div>

      {/* 3. Interactive Course Catalog Section - Bento Box Layout */}
      <div id="catalog-section" className="space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase flex justify-center items-center gap-2">
            <Sparkles className="text-amber-500 fill-amber-500/20" size={24} />
            Bento Course Catalog
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Click "Preview Syllabus" on any track to preview what you will learn week-by-week.
          </p>
        </div>

        {/* Bento Grid layout */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-6 gap-6"
        >
          {coursesList.map((course) => {
            const IconComp = course.icon;
            const glowStyles = getGlowStyles(course.id);
            return (
              <motion.div
                key={course.id}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className={`col-span-1 ${course.colSpan} flex`}
              >
                <Card 
                  className={`w-full p-6 flex flex-col justify-between relative overflow-hidden border border-slate-850 transition-all duration-350 ${glowStyles}`}
                  variant="glass"
                >
                  {/* Subtle decorative glow */}
                  <div className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${course.color} rounded-full blur-2xl opacity-40 pointer-events-none`}></div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-amber-400">
                        <IconComp size={22} />
                      </div>
                      <span className="text-[9px] font-black text-slate-500 bg-slate-950/80 border border-slate-900 px-2 py-0.5 rounded uppercase tracking-wider">
                        {course.difficulty}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-black text-white tracking-tight">{course.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{course.desc}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.tags.map((tag: string) => (
                        <span key={tag} className="text-[9px] font-bold text-slate-450 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-850/60 uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-850/60 flex items-center justify-between gap-4">
                    <button 
                      onClick={() => { setPreviewCourse(course); setActiveWeekPreview(1); }}
                      className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors animate-pulse hover:animate-none"
                    >
                      <BookOpen size={12} /> Preview Syllabus
                    </button>
                    <button 
                      onClick={scrollToEnroll}
                      className="text-[10px] font-black text-amber-450 hover:text-amber-300 uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      Enroll Now <ArrowRight size={12} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* 4. Student Hall of Fame Section (Issue #45) */}
      <div className="space-y-8 border-t border-slate-800/80 pt-16">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase flex justify-center items-center gap-2">
            <Trophy className="text-yellow-400" size={24} />
            Student Hall of Fame
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Meet our top students who are leading the leaderboard with high XP and quiz scores.
          </p>
        </div>

        {/* Podium Layout */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 pt-4 max-w-4xl mx-auto">
          {topStudents.length > 0 && (() => {
            const podiumStudents = [];
            if (topStudents[1]) podiumStudents.push({ ...topStudents[1], rank: 2, scale: 'scale-100', height: 'h-auto md:h-72', border: 'border-slate-350/40 shadow-slate-350/5', color: 'from-slate-400/5 via-slate-950 to-slate-950', badge: '🥈 Silver' });
            if (topStudents[0]) podiumStudents.push({ ...topStudents[0], rank: 1, scale: 'scale-100 md:scale-105', height: 'h-auto md:h-80 md:-translate-y-2', border: 'border-yellow-500/60 shadow-yellow-500/10', color: 'from-yellow-500/10 via-slate-950 to-slate-950', badge: '👑 Gold' });
            if (topStudents[2]) podiumStudents.push({ ...topStudents[2], rank: 3, scale: 'scale-100', height: 'h-auto md:h-64', border: 'border-amber-700/40 shadow-amber-700/5', color: 'from-amber-750/5 via-slate-950 to-slate-950', badge: '🥉 Bronze' });

            return podiumStudents.map((student) => {
              const orderClass = student.rank === 1 ? 'order-1 md:order-2' : student.rank === 2 ? 'order-2 md:order-1' : 'order-3 md:order-3';
              return (
                <motion.div
                  key={student.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className={`w-full md:w-1/3 ${orderClass} ${student.scale} flex`}
                >
                  <Card className={`w-full p-6 flex flex-col items-center text-center justify-between relative overflow-hidden border ${student.border} bg-gradient-to-b ${student.color} ${student.height}`} variant="glass">
                    <div className="absolute top-4 right-4">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-350">
                        {student.badge}
                      </span>
                    </div>

                    <div className="flex flex-col items-center mt-4">
                      <div className={`w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center font-black text-white text-base shadow-inner border mb-4 relative ${student.rank === 1 ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'border-slate-700'}`}>
                        {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        {student.rank === 1 && <span className="absolute -top-2 text-yellow-400 text-lg">👑</span>}
                      </div>

                      <h3 className="text-sm font-extrabold text-white">{student.name}</h3>
                      <p className="text-[10px] text-slate-500 font-semibold truncate max-w-full uppercase mt-0.5">{student.collegeName || 'Technology Institute'}</p>
                    </div>

                    <div className="flex flex-col items-center w-full mt-4 gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 border border-slate-900 rounded-full">
                        <Zap className="text-amber-400 fill-amber-400" size={13} />
                        <span className="text-xs font-black text-white font-mono">{student.points} <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">XP</span></span>
                      </div>

                      <div className="flex flex-wrap gap-1 justify-center max-h-[48px] overflow-hidden">
                        {student.badges && student.badges.length > 0 ? (
                          student.badges.slice(0, 2).map((b: string) => (
                            <span key={b} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 text-[8px] font-black uppercase text-slate-450 tracking-wider">
                              🏆 {b.replace(/_/g, ' ').replace('week 1 master', 'W1 Master').replace('bug hunter', 'Bug Hunter').replace('perfect score', 'Perfect')}
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] text-slate-650 italic">Consistent Learner</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            });
          })()}
        </div>

        {/* Collapsible View Top 10 Leaderboard Ranks */}
        {topStudents.length > 3 && (
          <div className="flex flex-col items-center pt-4">
            <button
              onClick={() => setShowAllLeaderboard(!showAllLeaderboard)}
              className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/40 text-[10px] font-black uppercase tracking-widest text-slate-450 hover:text-white transition flex items-center gap-2 cursor-pointer"
            >
              {showAllLeaderboard ? (
                <>Hide Ranks <ChevronUp size={12} /></>
              ) : (
                <>View Top 10 Ranks <ChevronDown size={12} /></>
              )}
            </button>

            <AnimatePresence>
              {showAllLeaderboard && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full max-w-2xl mt-4 overflow-hidden"
                >
                  <Card className="p-4 border border-slate-850" variant="glass">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-400">
                        <thead>
                          <tr className="border-b border-slate-900 text-slate-500 font-black uppercase tracking-wider text-[9px]">
                            <th className="py-2.5 px-3">Rank</th>
                            <th className="py-2.5 px-3">Student Name</th>
                            <th className="py-2.5 px-3">College Name</th>
                            <th className="py-2.5 px-3 text-right">XP Points</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/60">
                          {topStudents.slice(3, 10).map((student, idx) => (
                            <tr key={student.name} className="hover:bg-slate-900/30 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-slate-350">#{idx + 4}</td>
                              <td className="py-3 px-3 font-extrabold text-white">{student.name}</td>
                              <td className="py-3 px-3 text-slate-500 truncate max-w-[200px] uppercase text-[10px] font-semibold">{student.collegeName || 'Technology Institute'}</td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-amber-500 flex items-center justify-end gap-1">
                                <Zap className="text-amber-500 fill-amber-500/20" size={12} />
                                {student.points} XP
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 5. Value Propositions / Credibility Accreditations */}
      <div className="space-y-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-center text-slate-500 border-b border-slate-800/80 pb-4">Accreditation & Quality Standards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Verifiable Registry', desc: 'Secure database verification system with unique tracking IDs.' },
            { title: 'Secure Verification', desc: 'Each student gets a unique scannable QR Code and verifiable Registry ID.' },
            { title: 'Hands-on Labs', desc: 'Learn dynamically with real codes, timing maps, and ESP microcontroller drivers.' },
            { title: '100% Free Access', desc: 'No enrollment fees or payments for learning curriculum.' }
          ].map((val, i) => (
            <Card key={i} className="p-5 space-y-2 border border-slate-850" variant="glass">
              <CheckCircle2 className="text-amber-500" size={24} />
              <h4 className="text-sm font-bold text-white tracking-tight uppercase">{val.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{val.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* 6. Enrollment Portal (Login/Register Form Section) */}
      <div id="enrollment-section" className="flex justify-center pt-8 border-t border-slate-800/80">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md z-10"
        >
          <Card className="p-8 relative overflow-hidden border border-slate-800" variant="glass">
            
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
            className="mt-6 text-center bg-slate-900/40 border border-slate-900/60 rounded-2xl p-4 max-w-md mx-auto backdrop-blur-md"
          >
            <p className="text-xs text-slate-400 font-medium">
              Having trouble? Need help with activation?
            </p>
            <div className="flex justify-center items-center gap-6 mt-3">
              <a 
                href="https://chat.whatsapp.com/Ba4J77LOmzVBrlHjQtm6Ar?s=cl&p=a&mlu=1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider transition-colors"
              >
                <MessageSquare size={14} /> WhatsApp Help
              </a>
              <span className="text-slate-800">•</span>
              <a 
                href="https://t.me/+tCapxtLwxNNlZjY1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider transition-colors"
              >
                <Send size={14} /> Telegram Help
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Syllabus Timelines Preview Modal */}
      <AnimatePresence>
        {previewCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewCourse(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 lg:p-8 w-full max-w-2xl relative my-8"
            >
              {/* Close Trigger */}
              <button 
                onClick={() => setPreviewCourse(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-black bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full uppercase tracking-wider">
                    Syllabus Overview
                  </span>
                  <h2 className="text-2xl font-black text-white mt-3 uppercase tracking-tight">{previewCourse.title}</h2>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{previewCourse.desc}</p>
                </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-850 pb-2 mb-4">4-Week Training Roadmaps</h4>
                
                <div className="space-y-3">
                  {previewCourse.syllabus.map((weekData: any) => {
                    const isOpen = activeWeekPreview === weekData.week;
                    return (
                      <div 
                        key={weekData.week} 
                        className={`relative border rounded-2xl p-4 transition-all duration-350 ${isOpen ? 'border-amber-500/40 bg-amber-500/[0.02]' : 'border-slate-850 bg-slate-950/20 hover:border-slate-800'}`}
                      >
                        <button
                          onClick={() => setActiveWeekPreview(isOpen ? 0 : weekData.week)}
                          className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs transition-colors duration-300 ${isOpen ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)]' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                              0{weekData.week}
                            </div>
                            <div>
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Week {weekData.week} Module</span>
                              <h4 className="text-sm font-extrabold text-white tracking-tight">{weekData.title}</h4>
                            </div>
                          </div>
                          <div className={`text-slate-500 hover:text-white transition-transform duration-250 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                            <ChevronDown size={16} />
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3.5 pl-11 border-t border-slate-900/60 pt-3.5 space-y-3">
                                <p className="text-slate-450 text-xs leading-relaxed font-medium">{weekData.details}</p>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 rounded-xl text-[10px] font-black uppercase tracking-wider">
                                  <span>Milestone:</span>
                                  <span className="text-white font-mono">{weekData.milestone}</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

                <div className="pt-4 border-t border-slate-850 flex justify-end">
                  <Button 
                    variant="accent"
                    onClick={() => {
                      setPreviewCourse(null);
                      scrollToEnroll();
                    }}
                  >
                    Start Training Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;
