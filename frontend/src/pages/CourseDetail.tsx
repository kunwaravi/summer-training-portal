import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { useUI } from '../context/UIContext';
import api from '../api';
import { 
  Lock, Play, Clipboard, 
  CheckCircle2, Zap, Eye, Code2, Briefcase, FileText,
  MessageSquare, Cpu, ExternalLink, RefreshCw, ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { coursesConfig } from '../config/courses';

import CourseHero from '../components/organisms/CourseHero';
import SyllabusManager from '../components/organisms/SyllabusManager';
import EnrollmentPanel from '../components/organisms/EnrollmentPanel';
import Spinner from '../components/atoms/Spinner';
import CodePlayground from '../components/molecules/CodePlayground';

// Custom static database of Anti-Patterns
const antiPatternsData: Record<string, Record<number, { title: string; badCode: string; explanation: string; fix: string }>> = {
  C: {
    1: {
      title: 'Uninitialized Local Variables',
      badCode: 'int counter;\nprintf("%d", counter); // prints garbage value',
      explanation: 'Local variables are stored on the stack and contain whatever garbage bits were left in that memory location. Accessing them leads to non-deterministic behavior.',
      fix: 'int counter = 0;\nprintf("%d", counter); // Safe!'
    },
    2: {
      title: 'Missing Switch-Case Breaks',
      badCode: 'switch (state) {\n  case 1: start_pump();\n  case 2: open_valve(); // executes case 2 as well!\n}',
      explanation: 'If a case statement lacks a `break`, execution falls through to the next case automatically. This is a common source of logic corruption in state machines.',
      fix: 'switch (state) {\n  case 1:\n    start_pump();\n    break;\n  case 2:\n    open_valve();\n    break;\n}'
    },
    3: {
      title: 'Dangling Heap Pointers',
      badCode: 'int* ptr = malloc(sizeof(int));\nfree(ptr);\n*ptr = 20; // Dereferencing after free!',
      explanation: 'Freeing memory marks the location as available but does not change the pointer value. Subsequent writes will corrupt the heap metadata.',
      fix: 'int* ptr = malloc(sizeof(int));\nfree(ptr);\nptr = NULL; // Safe from reuse!'
    },
    4: {
      title: 'Invalid Bitwise Shift Offset',
      badCode: 'uint16_t reg = 1;\nreg = reg << 18; // Shift count >= width of type!',
      explanation: 'Shifting a value by an offset greater than or equal to its bit-width causes undefined behavior in standard C and may zero out registers.',
      fix: 'uint32_t reg = 1;\nreg = reg << 18; // Safe with 32-bit width!'
    }
  },
  IoT: {
    1: {
      title: 'Delay-Blocking Main Loop',
      badCode: 'void loop() {\n  read_sensor();\n  delay(5000); // Blocks Wi-Fi network keepalive!\n}',
      explanation: 'Using `delay()` stops all CPU cycles on ESP32, which blocks background Wi-Fi beacon checks, causing frequent connection drops and packet loss.',
      fix: 'unsigned long lastRun = 0;\nvoid loop() {\n  if (millis() - lastRun >= 5000) {\n    read_sensor();\n    lastRun = millis();\n  }\n}'
    },
    2: {
      title: 'Floating Analog Pins (LDR/ADC)',
      badCode: 'int val = analogRead(LDR_PIN); // No pull-down, floating wire',
      explanation: 'If the analog pin does not have a stable reference resistor, static charge in the environment will cause volatile voltage readings (noise).',
      fix: 'Connect a 10K Ohm resistor between ADC pin and GND (pull-down setup).'
    },
    3: {
      title: 'Large MQTT Payloads (Memory Exhaustion)',
      badCode: 'String payload = get_giant_json();\nclient.publish("metrics", payload);',
      explanation: 'ESP8266 and ESP32 have restricted RAM. Creating very large string buffers dynamically leads to heap fragmentation and silent system crashes.',
      fix: 'Use StaticJsonDocument from ArduinoJson library to serialize data directly into small arrays.'
    },
    4: {
      title: 'Unsecured Wi-Fi Credentials Storage',
      badCode: '#define WIFI_SSID "MyHomeWiFi"\n#define WIFI_PASS "12345678"',
      explanation: 'Hardcoding plaintext Wi-Fi parameters directly inside the firmware files exposes critical network credentials to anyone with access to the source code/binary.',
      fix: 'Load configurations dynamically using SPIFFS storage or a separate config.h excluded from git commits.'
    }
  },
  Embedded: {
    1: {
      title: 'Writing to GPIO Registers without Gating Clocks',
      badCode: 'GPIOA->ODR |= (1 << 5); // CRASH! clock not enabled',
      explanation: 'Modern ARM Cortex microcontrollers disable peripheral clocks by default to conserve energy. Modifying registers before gating clocks causes hard faults.',
      fix: 'RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN; // Enable clock first!'
    },
    2: {
      title: 'Blocking Delays Inside Interrupt Service Routines (ISRs)',
      badCode: 'ISR(TIMER1_COMPA_vect) {\n  printf("Timer tick\\n");\n  delay(10);\n}',
      explanation: 'ISRs must run as quickly as possible. Performing heavy operations (like I/O, UART printing, or delays) blocks other interrupts and leads to watchdog timer resets.',
      fix: 'ISR(TIMER1_COMPA_vect) {\n  flag_ticked = 1; // Set flag and return immediately\n}'
    },
    3: {
      title: 'Priority Inversion on Shared Mutexes',
      badCode: 'xSemaphoreTake(shMutex, portMAX_DELAY);\n// Critical section with low priority task',
      explanation: 'If a low priority task holds a mutex required by a high priority task, and a medium priority task preempts the low task, the high task is blocked indefinitely.',
      fix: 'Use mutexes with Priority Inheritance enabled to temporarily raise the low task priority.'
    },
    4: {
      title: 'Stack Overflow on Heavy RTOS Task Variables',
      badCode: 'void vTask(void* p) {\n  char large_buffer[512]; // Exceeds default task stack!\n}',
      explanation: 'RTOS tasks are allocated a fixed stack size at creation. Allocating large arrays on the task stack leads to immediate stack corruption and resets.',
      fix: 'Use dynamically allocated heap buffers or declare arrays as static if thread-safety permits.'
    }
  }
};

// Parser for step-by-step code annotations
const parseCodeSteps = (code: string) => {
  const lines = code.split('\n');
  const steps: Array<{ title: string; lines: string[]; explanation: string }> = [];
  let currentStep: { title: string; lines: string[]; explanation: string } | null = null;
  
  lines.forEach((line) => {
    const match = line.match(/^\s*\/\/\s*(Step\s+\d+:\s*(.*)|(Task.*))/i);
    if (match) {
      if (currentStep) {
        steps.push(currentStep);
      }
      currentStep = {
        title: match[1] || `Step ${steps.length + 1}`,
        lines: [line],
        explanation: match[2] || 'Configure memory register addresses or variables.'
      };
    } else {
      if (!currentStep) {
        currentStep = {
          title: 'Setup & Definitions',
          lines: [line],
          explanation: 'Initialize boilerplate libraries, definitions, or helper headers.'
        };
      } else {
        currentStep.lines.push(line);
      }
    }
  });
  if (currentStep) {
    steps.push(currentStep);
  }
  return steps;
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useUI();
  const [mobileView, setMobileView] = useState<'chapters' | 'content'>('chapters');
  
  const {
    weeks,
    activeWeekIndex,
    setActiveWeekIndex,
    loadingSyllabus,
    loadingDetails,
    activeModuleDetail,
    isPaid,
    checkingPayment,
    currentWeek,
    setIsPaid
  } = useCourseDetail(id);

  const courseConf = coursesConfig.find(c => c.id === id);
  const courseTitle = courseConf ? courseConf.title : 'Specialized Course';

  const [viewState, setViewState] = useState<'course-home' | 'module-home' | 'topic-reader'>('course-home');
  const [activeTopicIndex, setActiveTopicIndex] = useState<number | null>(null);

  const [hasReadMaterial, setHasReadMaterial] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<React.ReactNode | null>(null);
  const [activeTab, setActiveTab] = useState<'material' | 'project'>('material');
  const [activePlayground, setActivePlayground] = useState<number | null>(null);
  const [activeCodeStep, setActiveCodeStep] = useState<string | null>(null);

  // Deliverables State
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submittingWeek, setSubmittingWeek] = useState<number | null>(null);
  const [submittingFileName, setSubmittingFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    if (!id) return;
    setLoadingSubmissions(true);
    try {
      const res = await api.get(`/assignments/status/${id}`);
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSubmissions();
    }
  }, [id, fetchSubmissions]);

  const handleUploadAssignment = async (weekNum: number) => {
    if (!submittingFileName.trim()) {
      addToast('Please enter a valid file name.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await api.post('/assignments/submit', {
        courseId: id,
        weekNumber: weekNum,
        fileName: submittingFileName,
        fileUrl: `/uploads/mock_${submittingFileName}`
      });
      if (res.data.success) {
        addToast(`Week ${weekNum} assignment submitted successfully!`, 'success');
        setSubmittingWeek(null);
        setSubmittingFileName('');
        fetchSubmissions();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit assignment.';
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = (code: string, topicIndex: number) => {
    navigator.clipboard.writeText(code);
    setCopiedText(`${topicIndex}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAskDoubt = (topicTitle: string) => {
    const text = encodeURIComponent(`Hi Nexus! I have a doubt in Course: ${courseTitle}, Week ${selectedWeek?.week || activeWeekIndex + 1}, Topic: ${topicTitle}.`);
    const channel = Math.random() > 0.5 
      ? 'https://chat.whatsapp.com/Ba4J77LOmzVBrlHjQtm6Ar' 
      : 'https://t.me/+tCapxtLwxNNlZjY1';
    window.open(`${channel}?text=${text}`, '_blank');
  };

  const selectedWeek = weeks[activeWeekIndex];
  const currentAntiPattern = antiPatternsData[id as string]?.[selectedWeek?.week];

  // Concept Infographic Blueprint Renderer (Issue #13)
  const renderWeeklyDiagram = (courseKey: string, weekNum: number) => {
    const strokeColor = "#22d3ee"; // cyan-400
    const accentColor = "#3b82f6"; // blue-500
    const textTheme = "fill-slate-300 font-sans text-[11px] font-bold text-center";
    
    if (courseKey === "C") {
      if (weekNum === 1) {
        return (
          <svg viewBox="0 0 320 200" className="w-full h-auto max-h-[160px]">
            <rect x="10" y="10" width="80" height="30" rx="6" fill="#1e293b" stroke={accentColor} strokeWidth="1.5" />
            <text x="50" y="28" textAnchor="middle" className={textTheme}>Source (.c)</text>
            <path d="M 50 40 L 50 65" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#arrow)" />
            <rect x="10" y="65" width="80" height="30" rx="6" fill="#1e293b" stroke={accentColor} strokeWidth="1.5" />
            <text x="50" y="83" textAnchor="middle" className={textTheme}>Compiler</text>
            <path d="M 90 80 L 140 80" stroke={strokeColor} strokeWidth="1.5" />
            <text x="115" y="73" textAnchor="middle" className="fill-cyan-400 text-[9px] font-extrabold">Assembly</text>
            <rect x="140" y="65" width="80" height="30" rx="6" fill="#1e293b" stroke={accentColor} strokeWidth="1.5" />
            <text x="180" y="83" textAnchor="middle" className={textTheme}>Linker</text>
            <path d="M 180 95 L 180 120" stroke={strokeColor} strokeWidth="1.5" />
            <rect x="140" y="120" width="80" height="35" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="180" y="141" textAnchor="middle" className="fill-emerald-400 font-sans text-xs font-black">Binary (.exe)</text>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeColor} />
              </marker>
            </defs>
          </svg>
        );
      }
      if (weekNum === 2) {
        return (
          <svg viewBox="0 0 320 200" className="w-full h-auto max-h-[160px]">
            <polygon points="160,20 240,60 160,100 80,60" fill="#1e293b" stroke={accentColor} strokeWidth="1.5" />
            <text x="160" y="64" textAnchor="middle" className={textTheme}>if (Score &gt;= 60)</text>
            <path d="M 240 60 L 270 60 L 270 120" stroke="#10b981" strokeWidth="1.5" />
            <text x="285" y="85" textAnchor="middle" className="fill-emerald-400 text-[10px] font-black">TRUE</text>
            <rect x="230" y="120" width="80" height="30" rx="6" fill="#065f46" stroke="#10b981" strokeWidth="1" />
            <text x="270" y="138" textAnchor="middle" className="fill-white text-[9px] font-black">PASS EXAM</text>
            <path d="M 80 60 L 50 60 L 50 120" stroke="#ef4444" strokeWidth="1.5" />
            <text x="35" y="85" textAnchor="middle" className="fill-red-400 text-[10px] font-black">FALSE</text>
            <rect x="10" y="120" width="80" height="30" rx="6" fill="#991b1b" stroke="#ef4444" strokeWidth="1" />
            <text x="50" y="138" textAnchor="middle" className="fill-white text-[9px] font-black">FAIL RETRY</text>
          </svg>
        );
      }
      if (weekNum === 3) {
        return (
          <svg viewBox="0 0 320 200" className="w-full h-auto max-h-[160px]">
            <g transform="translate(10, 50)">
              <rect x="0" y="20" width="50" height="40" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
              <text x="25" y="45" textAnchor="middle" className="fill-white font-mono text-sm font-bold">10</text>
              <text x="25" y="80" textAnchor="middle" className="fill-slate-500 font-mono text-[9px]">Idx 0</text>
              <rect x="50" y="20" width="50" height="40" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
              <text x="75" y="45" textAnchor="middle" className="fill-white font-mono text-sm font-bold">20</text>
              <text x="75" y="80" textAnchor="middle" className="fill-slate-500 font-mono text-[9px]">Idx 1</text>
              <rect x="100" y="20" width="50" height="40" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
              <text x="125" y="45" textAnchor="middle" className="fill-white font-mono text-sm font-bold">30</text>
              <text x="125" y="80" textAnchor="middle" className="fill-slate-500 font-mono text-[9px]">Idx 2</text>
              <rect x="150" y="20" width="50" height="40" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
              <text x="175" y="45" textAnchor="middle" className="fill-white font-mono text-sm font-bold">40</text>
              <text x="175" y="80" textAnchor="middle" className="fill-slate-500 font-mono text-[9px]">Idx 3</text>
            </g>
            <text x="110" y="30" textAnchor="middle" className="fill-cyan-400 text-xs font-black">Contiguous Array Layout</text>
          </svg>
        );
      }
      if (weekNum === 4) {
        return (
          <svg viewBox="0 0 320 200" className="w-full h-auto max-h-[160px]">
            <rect x="20" y="50" width="80" height="40" rx="6" fill="#1e293b" stroke={strokeColor} strokeWidth="1.5" />
            <text x="60" y="70" textAnchor="middle" className="fill-cyan-400 font-mono text-xs font-extrabold">int *ptr</text>
            <text x="60" y="82" textAnchor="middle" className="fill-slate-500 font-mono text-[8px]">Holds: 0x7FFA</text>
            <path d="M 100 70 L 180 70" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#goldArrow)" />
            <text x="140" y="60" textAnchor="middle" className="fill-amber-400 text-[8px] font-bold">Points To</text>
            <rect x="190" y="50" width="100" height="45" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="240" y="72" textAnchor="middle" className="fill-emerald-400 font-mono text-sm font-black">100</text>
            <text x="240" y="86" textAnchor="middle" className="fill-slate-400 font-mono text-[8px]">Address: 0x7FFA</text>
            <defs>
              <marker id="goldArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
              </marker>
            </defs>
          </svg>
        );
      }
    }
    
    return (
      <svg viewBox="0 0 320 200" className="w-full h-auto max-h-[160px]">
        <circle cx="60" cy="100" r="30" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
        <text x="60" y="104" textAnchor="middle" className="fill-white text-[9px] font-black">{courseKey} Micro</text>
        <path d="M 90 100 L 150 100" stroke={strokeColor} strokeWidth="2" />
        <rect x="150" y="75" width="80" height="50" rx="8" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
        <text x="190" y="104" textAnchor="middle" className="fill-cyan-400 text-[10px] font-bold">Registers</text>
        <path d="M 230 100 L 280 100" stroke={strokeColor} strokeWidth="2" />
        <circle cx="290" cy="100" r="10" fill="#10b981" />
        <text x="190" y="50" textAnchor="middle" className="fill-amber-400 text-[9px] font-black">Chapter {weekNum} Concept</text>
      </svg>
    );
  };

  if (loadingSyllabus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Spinner size="lg" />
        <p className="text-slate-400 text-sm font-semibold">Decrypting curriculum syllabus registry...</p>
      </div>
    );
  }

  const completedPercentage = weeks.length > 0 ? Math.min(Math.round(((currentWeek) / weeks.length) * 100), 100) : 0;
  const wordCount = selectedWeek?.description?.split(/\s+/).length + (activeModuleDetail?.topics?.reduce((acc: number, t: any) => acc + (t.text?.split(/\s+/).length || 0), 0) || 0);
  const readingTime = Math.max(Math.ceil(wordCount / 180), 1);

  return (
    <div className="py-6 max-w-6xl mx-auto px-4 space-y-6">
      
      <CourseHero 
        courseId={id} 
        courseTitle={courseTitle}
        weekTitle={selectedWeek ? `Chapter ${selectedWeek.week}: ${selectedWeek.title}` : undefined}
        topicTitle={activeTopicIndex !== null && activeModuleDetail?.topics?.[activeTopicIndex] ? activeModuleDetail.topics[activeTopicIndex].title : undefined}
        viewState={viewState}
        setViewState={setViewState}
        mobileView={mobileView}
        onBackClick={() => setMobileView('chapters')}
      />

      {/* Main Split-Screen Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        <div className={`w-full lg:w-1/3 shrink-0 ${mobileView === 'content' ? 'hidden lg:block' : 'block'}`}>
          <SyllabusManager 
            weeks={weeks}
            activeWeekIndex={activeWeekIndex}
            setActiveWeekIndex={setActiveWeekIndex}
            currentWeek={currentWeek}
            completedPercentage={completedPercentage}
            viewState={viewState}
            setViewState={setViewState}
            onWeekChange={() => {
              setHasReadMaterial(false);
              setActivePlayground(null);
              setActiveCodeStep(null);
              setActiveTopicIndex(null);
              setMobileView('content');
            }}
          />
        </div>

        {/* Right Column: Dynamic E-Learning Viewer Console */}
        <div className={`flex-1 w-full bg-slate-900/30 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 overflow-hidden ${mobileView === 'chapters' ? 'hidden lg:block' : 'block'}`}>
          
          {viewState === 'course-home' ? (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded">
                  Course Overview
                </span>
                <h2 className="text-2xl font-black text-white">{courseTitle}</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {/* @ts-ignore */}
                  {courseConf?.desc || 'Welcome to this specialized curriculum track. Learn low-level hardware constraints, memory mappings, and system programming paradigms.'}
                </p>
              </div>

              {/* Course Meta Info Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Duration</span>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">4-Week Immersion</p>
                </div>
                <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Chapters</span>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">{weeks.length} Interactive Modules</p>
                </div>
                <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Prerequisites</span>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">Basic Logic Foundations</p>
                </div>
              </div>

              {/* Learning Syllabus Milestones */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Syllabus Chapters Timeline</h3>
                <div className="space-y-2.5">
                  {weeks.map((week, index) => {
                    const isUnlocked = index <= currentWeek;
                    const isCompleted = index < currentWeek;
                    return (
                      <div 
                        key={index}
                        onClick={() => {
                          if (isUnlocked) {
                            setActiveWeekIndex(index);
                            setViewState('module-home');
                          }
                        }}
                        className={`p-4 rounded-xl border flex items-center justify-between transition group ${
                          isUnlocked 
                            ? 'bg-slate-950/40 border-slate-850 hover:border-cyan-500/40 cursor-pointer' 
                            : 'bg-slate-950/10 border-slate-900/50 opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black uppercase ${
                            isCompleted 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : isUnlocked 
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                                : 'bg-slate-800 text-slate-500'
                          }`}>
                            W{week.week}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition">{week.title}</h4>
                            <p className="text-[9px] text-slate-550">Chapter {week.week} Curriculum module.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                            {isCompleted ? 'Completed' : isUnlocked ? 'Start Chapter' : 'Locked'}
                          </span>
                          <ChevronRight size={12} className="text-slate-600 group-hover:text-white transition" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Start/Continue CTA Button */}
              <button
                onClick={() => {
                  const continueIdx = Math.min(currentWeek, weeks.length - 1);
                  setActiveWeekIndex(continueIdx);
                  setViewState('module-home');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold text-sm uppercase tracking-widest rounded-xl transition shadow active:scale-95 cursor-pointer"
              >
                {currentWeek > 0 ? 'Continue Curriculum' : 'Start Curriculum'}
              </button>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex gap-4 border-b border-slate-800 pb-1">
                <button 
                  onClick={() => setActiveTab('material')}
                  className={`pb-3 px-2 text-xs font-black uppercase tracking-widest transition-all relative ${
                    activeTab === 'material' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={14} /> Study Material
                  </div>
                  {activeTab === 'material' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                </button>
                <button 
                  onClick={() => setActiveTab('project')}
                  className={`pb-3 px-2 text-xs font-black uppercase tracking-widest transition-all relative ${
                    activeTab === 'project' ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} /> Project & Assignment
                  </div>
                  {activeTab === 'project' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
                </button>
              </div>

              {activeTab === 'material' ? (
                <>
                  {loadingDetails ? (
                    <div className="space-y-6 animate-pulse py-4">
                      <div className="h-6 w-32 bg-slate-800 rounded"></div>
                      <div className="h-8 w-2/3 bg-slate-800 rounded"></div>
                      <div className="h-4 w-full bg-slate-800 rounded"></div>
                      <div className="space-y-6 pt-10 border-t border-slate-850">
                        {[1, 2].map((i) => (
                          <div key={i} className="space-y-3 pl-8 relative">
                            <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-slate-800"></div>
                            <div className="h-6 w-40 bg-slate-800 rounded"></div>
                            <div className="h-4 w-full bg-slate-800 rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {viewState === 'module-home' ? (
                        <motion.div
                          key="module-home-view"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-6"
                        >
                          {/* Header block */}
                          <div className="flex justify-between items-start gap-4 flex-wrap text-left">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="inline-block text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded">
                                  Chapter {selectedWeek?.week} Module Outline
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded uppercase tracking-wider">
                                  ⏱ {readingTime} Min Read
                                </span>
                              </div>
                              <h2 className="text-2xl font-extrabold tracking-tight text-white">{selectedWeek?.title}</h2>
                              <p className="text-slate-400 text-sm mt-1">{selectedWeek?.description}</p>
                            </div>
                          </div>

                          {/* List of Topic Cards */}
                          <div className="space-y-3.5 text-left">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Curriculum Study Topics</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {activeModuleDetail?.topics?.map((topic: any, idx: number) => (
                                <div 
                                  key={idx}
                                  onClick={() => {
                                    setActiveTopicIndex(idx);
                                    setViewState('topic-reader');
                                  }}
                                  className="p-5 bg-slate-950/40 hover:bg-slate-950/20 border border-slate-850 hover:border-cyan-500/50 rounded-2xl transition duration-300 cursor-pointer group flex flex-col justify-between h-36 shadow-inner text-left"
                                >
                                  <div className="space-y-1.5">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                                      Topic {idx + 1}
                                    </span>
                                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition truncate">{topic.title}</h4>
                                    <p className="text-[10px] text-slate-500 line-clamp-2">
                                      {topic.text ? topic.text.replace(/[#*`_]/g, '').slice(0, 100) : 'Learn about this core concepts in detail.'}
                                    </p>
                                  </div>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-450 group-hover:text-white transition flex items-center gap-1">
                                    Start Reading <ChevronRight size={10} />
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Online Circuit Simulators Callout Box */}
                          {(id === 'IoT' || id === 'Embedded' || id === 'C') && (
                            <div className="p-5 rounded-2xl border border-blue-500/25 bg-blue-500/5 space-y-3 mt-4 text-left">
                              <div className="flex items-center gap-2 text-blue-400">
                                <Cpu size={18} className="animate-pulse" />
                                <h4 className="text-xs font-black uppercase tracking-widest">Interactive Circuit Simulators</h4>
                              </div>
                              <p className="text-slate-400 text-xs leading-relaxed">
                                No hardware? You can compile, run, and test your systems applications directly on browser-based online circuit simulator boxes:
                              </p>
                              <div className="flex flex-wrap gap-3 pt-1">
                                {id === 'IoT' && (
                                  <a 
                                    href="https://wokwi.com/projects/arduino-esp32-blink" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold uppercase rounded text-[9px] transition-colors"
                                  >
                                    <ExternalLink size={12} /> Launch Wokwi ESP32 board Setup
                                  </a>
                                )}
                                {id === 'Embedded' && (
                                  <a 
                                    href="https://www.tinkercad.com/circuits" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold uppercase rounded text-[9px] transition-colors"
                                  >
                                    <ExternalLink size={12} /> Launch Tinkercad Circuits Online
                                  </a>
                                )}
                                {id === 'C' && (
                                  <a 
                                    href="https://wokwi.com/projects/new/c" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold uppercase rounded text-[9px] transition-colors"
                                  >
                                    <ExternalLink size={12} /> Launch Wokwi C sandbox
                                  </a>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Why It Fails - Anti-Patterns comparative block */}
                          {currentAntiPattern && (
                            <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-3.5 mt-6 text-left">
                              <div className="flex items-center gap-2 text-red-400">
                                <span className="text-lg leading-none select-none">⚠️</span>
                                <h4 className="text-xs font-black uppercase tracking-widest">Why It Fails: Common Anti-Patterns</h4>
                              </div>
                              <div className="space-y-2">
                                <p className="text-slate-200 text-xs font-extrabold">{currentAntiPattern.title}</p>
                                <p className="text-slate-400 text-[11px] leading-relaxed">{currentAntiPattern.explanation}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                  <div className="p-3 bg-red-950/10 border border-red-900/30 rounded-xl font-mono text-[10px] text-red-300">
                                    <p className="text-red-400 font-extrabold uppercase text-[8px] tracking-wider mb-1">❌ Bad Anti-Pattern Code</p>
                                    <pre className="overflow-x-auto whitespace-pre">{currentAntiPattern.badCode}</pre>
                                  </div>
                                  <div className="p-3 bg-emerald-950/10 border border-emerald-900/30 rounded-xl font-mono text-[10px] text-emerald-300">
                                    <p className="text-emerald-400 font-extrabold uppercase text-[8px] tracking-wider mb-1">✔️ Correct Fix Pattern</p>
                                    <pre className="overflow-x-auto whitespace-pre">{currentAntiPattern.fix}</pre>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Concept Visualized Blueprint */}
                          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 text-left">
                            <div className="flex items-center gap-2 text-cyan-400">
                              <Zap size={18} className="animate-pulse" />
                              <h4 className="text-xs font-black uppercase tracking-widest">Concept Visualized Blueprint</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                              <div className="space-y-2 text-slate-300 text-xs leading-relaxed">
                                <p className="font-bold text-slate-200">Interactive Blueprint Visualization</p>
                                <p>Study this visual schematic representation of the concepts introduced this week.</p>
                                <button 
                                  onClick={() => setLightboxImage(renderWeeklyDiagram(id as string, selectedWeek?.week))}
                                  className="flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-400 hover:text-white font-extrabold uppercase rounded text-[9px] border border-slate-700/60 transition cursor-pointer"
                                >
                                  <Eye size={12} /> Click Diagram to Expand
                                </button>
                              </div>
                              <div 
                                onClick={() => setLightboxImage(renderWeeklyDiagram(id as string, selectedWeek?.week))}
                                className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/80 hover:bg-slate-950/20 transition duration-300 cursor-pointer flex justify-center items-center group shadow-md"
                              >
                                <div className="transform group-hover:scale-[1.02] transition duration-300 w-full max-w-[280px]">
                                  {renderWeeklyDiagram(id as string, selectedWeek?.week)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Module Verification */}
                          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 text-left">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-355">Module Verification</h4>
                            {activeWeekIndex < currentWeek ? (
                              <div className="flex flex-wrap items-center gap-3 text-emerald-400">
                                <CheckCircle2 size={24} />
                                <div>
                                  <p className="text-sm font-bold">Chapter {selectedWeek?.week} Completed!</p>
                                  <p className="text-xs text-slate-400">You passed the quiz. Re-take it to improve your score.</p>
                                </div>
                                <button 
                                  onClick={() => navigate(`/quiz/${id}/${selectedWeek?.week}`)}
                                  className="ml-auto text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-slate-300 font-semibold transition cursor-pointer"
                                >
                                  Retry Quiz
                                </button>
                              </div>
                            ) : activeWeekIndex === currentWeek ? (
                              <div className="space-y-4">
                                <label className="flex items-start gap-3 cursor-pointer group text-xs text-slate-400 select-none">
                                  <input 
                                    type="checkbox"
                                    checked={hasReadMaterial}
                                    onChange={(e) => setHasReadMaterial(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 text-cyan-600 rounded bg-slate-800 border-slate-700"
                                  />
                                  <span className="group-hover:text-slate-200 transition">
                                    I have read and understood all the study concepts for Chapter {selectedWeek?.week}. I am ready to attempt the quiz.
                                  </span>
                                </label>
                                <button 
                                  disabled={!hasReadMaterial}
                                  onClick={() => navigate(`/quiz/${id}/${selectedWeek?.week}`)}
                                  className={`w-full py-3 rounded-xl font-extrabold text-sm transition flex items-center justify-center gap-2 text-white shadow-lg cursor-pointer ${
                                    hasReadMaterial ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                  }`}
                                >
                                  <Play size={16} /> Unlock & Start Chapter {selectedWeek?.week} Quiz
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 text-slate-500 text-xs">
                                <Lock size={18} />
                                <span>Complete Chapter {currentWeek + 1} quiz to unlock these materials.</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        /* Topic Reader view */
                        (() => {
                          const topicIndex = activeTopicIndex !== null ? activeTopicIndex : 0;
                          const topic = activeModuleDetail?.topics?.[topicIndex];
                          const topics = activeModuleDetail?.topics || [];
                          const hasPrev = topicIndex > 0;
                          const hasNext = topicIndex < topics.length - 1;

                          if (!topic) return null;

                          return (
                            <motion.div
                              key={`topic-reader-${topicIndex}`}
                              initial={{ opacity: 0, x: 15 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -15 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-6 text-left"
                            >
                              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded">
                                  Topic {topicIndex + 1} of {topics.length}
                                </span>
                                <button 
                                  onClick={() => handleAskDoubt(topic.title)}
                                  className="px-2.5 py-1 text-[9px] font-black uppercase text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <MessageSquare size={11} /> Ask Doubt
                                </button>
                              </div>

                              <h2 className="text-xl font-extrabold tracking-tight text-white">{topic.title}</h2>
                              
                              <div className="prose prose-invert prose-sm max-w-none text-slate-350 leading-relaxed">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {topic.text}
                                </ReactMarkdown>
                              </div>

                              {topic.code && (
                                <div className="space-y-4">
                                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/60 relative group/code shadow-inner p-4">
                                    {(() => {
                                      const steps = parseCodeSteps(topic.code);
                                      return (
                                        <div className="space-y-4">
                                          {/* Code Steps Tabs */}
                                          <div className="flex flex-wrap gap-2 border-b border-slate-850 pb-2">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest self-center mr-2">Code-Along Steps:</span>
                                            {steps.map((step, sIdx) => {
                                              const isSelected = activeCodeStep === `${topicIndex}-${sIdx}` || (!activeCodeStep && sIdx === 0);
                                              return (
                                                <button
                                                  key={sIdx}
                                                  onClick={() => {
                                                    setActiveCodeStep(`${topicIndex}-${sIdx}`);
                                                  }}
                                                  className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                                                    isSelected
                                                      ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                                                      : 'bg-slate-900 border-slate-800 text-slate-450 hover:text-slate-200'
                                                  }`}
                                                >
                                                  Step {sIdx + 1}
                                                </button>
                                              );
                                            })}
                                          </div>

                                          {/* Code Display Area */}
                                          {(() => {
                                            const activeStepIdx = activeCodeStep && activeCodeStep.startsWith(`${topicIndex}-`)
                                              ? parseInt(activeCodeStep.split('-')[1])
                                              : 0;
                                            const step = steps[activeStepIdx] || steps[0];
                                            if (!step) return null;
                                            
                                            return (
                                              <div className="space-y-3">
                                                <div className="relative">
                                                  <div className="absolute right-0 top-0 flex gap-2">
                                                    <button
                                                      onClick={() => setActivePlayground(topicIndex)}
                                                      className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                                                    >
                                                      <Code2 size={12} /> Sandbox Tryout
                                                    </button>
                                                    <button
                                                      onClick={() => handleCopyCode(topic.code, topicIndex)}
                                                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-455 hover:text-white transition-all text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                                                    >
                                                      <Clipboard size={12} />
                                                      {copiedText === `${topicIndex}` ? 'Copied!' : 'Copy'}
                                                    </button>
                                                  </div>

                                                  <div className="overflow-x-auto w-full pt-8 sm:pt-4">
                                                    <pre className="text-xs font-mono text-cyan-400 leading-relaxed min-w-[300px]">
                                                      <code>
                                                        {step.lines.join('\n')}
                                                      </code>
                                                    </pre>
                                                  </div>
                                                </div>

                                                {/* Step specific Explanation / Why annotation */}
                                                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-slate-300 text-[11px] leading-relaxed">
                                                  <strong className="text-blue-300 uppercase tracking-widest text-[9px] block mb-1">🔍 Why this step?</strong>
                                                  {step.explanation}
                                                </div>
                                              </div>
                                            );
                                          })()}
                                        </div>
                                      );
                                    })()}
                                  </div>

                                  {/* Interactive Playground Sandbox */}
                                  <AnimatePresence>
                                    {activePlayground === topicIndex && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                      >
                                        <CodePlayground 
                                          initialCode={topic.code} 
                                          language={id === 'C' || id === 'C++' ? 'C/C++' : 'MicroPython'} 
                                        />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}

                              {topic.note && (
                                <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-300 text-xs leading-relaxed flex items-start gap-3">
                                  <span className="text-lg leading-none select-none">💡</span>
                                  <div>
                                    <strong className="text-teal-200 block mb-0.5">Core Takeaway</strong>
                                    {topic.note}
                                  </div>
                                </div>
                              )}

                              {/* Reader Control Row */}
                              <div className="flex justify-between items-center pt-6 border-t border-slate-800 mt-8">
                                <button
                                  onClick={() => {
                                    if (hasPrev) {
                                      setActiveTopicIndex(topicIndex - 1);
                                      setActiveCodeStep(null);
                                    } else {
                                      setViewState('module-home');
                                    }
                                  }}
                                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-extrabold uppercase rounded-lg text-[10px] tracking-wider transition cursor-pointer"
                                >
                                  ← {hasPrev ? 'Prev Topic' : 'Back to Outline'}
                                </button>
                                
                                <button
                                  onClick={() => {
                                    if (hasNext) {
                                      setActiveTopicIndex(topicIndex + 1);
                                      setActiveCodeStep(null);
                                    } else {
                                      setViewState('module-home');
                                      // Scroll down to the verification / quiz unlock block in module-home
                                      setTimeout(() => {
                                        window.scrollTo({
                                          top: document.body.scrollHeight,
                                          behavior: 'smooth'
                                        });
                                      }, 100);
                                    }
                                  }}
                                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold uppercase rounded-lg text-[10px] tracking-widest transition cursor-pointer shadow-lg shadow-cyan-600/10"
                                >
                                  {hasNext ? 'Next Topic →' : 'Done & Go to Quiz'}
                                </button>
                              </div>
                            </motion.div>
                          );
                        })()
                      )}
                    </AnimatePresence>
                  )}
                </>
              ) : (
                /* Project & Assignment Tab Content */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-4 space-y-8"
                >
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 border-l-4 border-l-purple-500 text-left relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none"></div>
                    <h3 className="text-xl font-extrabold text-white mb-2">Industrial Project Submission</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      As part of your training, you are required to submit a practical implementation of the concepts learned. 
                      This is mandatory for generating your final certificate.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300">
                        Status: <span className="text-amber-400 font-extrabold">{currentWeek >= 20 ? 'Eligible for Certificate' : 'Pending Eligibility'}</span>
                      </div>
                      <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300">
                        Syllabus Completed: <span className="text-purple-400 font-black">{currentWeek}/20 Chapters</span>
                      </div>
                    </div>
                  </div>

                  {loadingSubmissions ? (
                    <div className="flex justify-center items-center py-12">
                      <Spinner size="md" />
                    </div>
                  ) : (
                    <div className="space-y-6 text-left">
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Weekly Micro-Deliverables Checklist</h4>
                      {[1, 2, 3, 4].map((weekNum) => {
                        const submission = submissions.find(s => s.weekNumber === weekNum);
                        const requiredModule = weekNum * 5;
                        const isUnlocked = currentWeek >= requiredModule;
                        return (
                          <div key={weekNum} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-slate-700/80">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-purple-400 uppercase tracking-wide">Week {weekNum} Deliverable</span>
                                {submission ? (
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${submission.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>{submission.status}</span>
                                ) : isUnlocked ? (
                                  <span className="text-[8px] font-black uppercase bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded">Eligible</span>
                                ) : (
                                  <span className="text-[8px] font-black uppercase bg-slate-800 border border-slate-700 text-slate-500 px-2 py-0.5 rounded">Locked</span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-white">Week {weekNum} Practical Task Submission</p>
                              {submission?.feedback && <div className="p-2.5 bg-slate-950/60 border border-slate-850 rounded-xl text-[10px] text-slate-400 mt-2">{submission.feedback}</div>}
                            </div>
                            <div className="shrink-0 flex items-center">
                              {submission ? (
                                <div className="text-[10px] text-slate-500 font-mono flex flex-col items-end gap-1">
                                  <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
                                </div>
                              ) : isUnlocked ? (
                                submittingWeek === weekNum ? (
                                  <div className="flex flex-col gap-2 w-full md:w-56 text-left">
                                    <input type="text" placeholder="Enter file name (e.g. main.c)" value={submittingFileName} onChange={(e) => setSubmittingFileName(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500" />
                                    <div className="flex gap-2">
                                      <button disabled={isSubmitting} onClick={() => handleUploadAssignment(weekNum)} className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold uppercase rounded text-[9px] tracking-wider transition-colors">Confirm</button>
                                    </div>
                                  </div>
                                ) : (
                                  <button onClick={() => { setSubmittingWeek(weekNum); setSubmittingFileName(''); }} className="w-full md:w-36 py-2 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 hover:border-purple-500/50 text-purple-400 font-extrabold text-[9px] uppercase tracking-widest rounded-lg">Upload</button>
                                )
                              ) : <div className="text-[10px] text-slate-500 font-semibold uppercase"><Lock size={12} /> Locked</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Bottom Navigation */}
              {activeTab === 'material' && viewState === 'module-home' && (
                <div className="flex justify-between items-center pt-6 border-t border-slate-800/80 mt-10">
                  <button disabled={activeWeekIndex === 0} onClick={() => { setActiveWeekIndex(activeWeekIndex - 1); }} className="px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-[11px] font-extrabold uppercase tracking-wider disabled:opacity-30 transition cursor-pointer">← Prev Module</button>
                  <button disabled={activeWeekIndex >= Math.min(currentWeek, weeks.length - 1)} onClick={() => { setActiveWeekIndex(activeWeekIndex + 1); }} className="px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-[11px] font-extrabold uppercase tracking-wider disabled:opacity-30 transition cursor-pointer">Next Module →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {(currentWeek >= weeks.length || new URLSearchParams(window.location.search).get('pay_debug') === 'true') && !checkingPayment && (
        <EnrollmentPanel 
          courseId={id}
          user={user}
          isPaid={isPaid}
          onPaymentSuccess={() => setIsPaid(true)}
          navigate={navigate}
        />
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-950/70 border border-slate-800 p-8 rounded-2xl w-full max-w-2xl relative flex flex-col items-center"
            >
              <button 
                onClick={() => setLightboxImage(null)}
                className="absolute right-4 top-4 text-xs font-bold text-slate-500 hover:text-white"
              >
                Close ✕
              </button>
              <div className="w-full flex justify-center">{lightboxImage}</div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4">
                Interactive Technical Blueprint - Concept Visualized
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseDetail;
