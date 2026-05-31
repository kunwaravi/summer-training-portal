import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, Lock, BookOpen, Play, ArrowLeft, Clipboard, 
  CheckCircle2, ChevronRight, Zap, Award, ChevronDown, ChevronUp,
  Sparkles, ShieldAlert, Check, Eye, TestTube, FileText, UploadCloud, MessageSquare, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckoutModal } from '../components/course/CheckoutModal';
import { coursesConfig } from '../config/courses';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, login, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [modules, setModules] = useState<any[]>([]);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  
  // Accordion state (expanded modules)
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({ 0: true });
  
  // Navigation tabs in Right area
  const [activeContentTab, setActiveContentTab] = useState<'notes' | 'pdfs' | 'assignment' | 'discussion'>('notes');

  const [readTopics, setReadTopics] = useState<string[]>([]); // Track completed topic IDs: "moduleOrder-topicIndex"
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  const [loadingSyllabus, setLoadingSyllabus] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [activeModuleDetail, setActiveModuleDetail] = useState<any>(null);

  // Payments / Paywall states
  const [isPaid, setIsPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [upiCopied, setUpiCopied] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Hardware Sandbox states
  const [sandboxTab, setSandboxTab] = useState<'pinout' | 'console' | 'register'>('pinout');
  const [registerVal, setRegisterVal] = useState<number[]>([0,0,1,0,1,0,0,0]);
  const [serialLogs, setSerialLogs] = useState<string[]>([
    "[SYSTEM] Booting ARM Cortex-M4 Core...",
    "[SYSTEM] Clock configuration SCLK = 84MHz",
    "[INFO] Direct Register Masking Engine initialized."
  ]);

  const toggleRegisterBit = (bitIndex: number) => {
    setRegisterVal(prev => {
      const updated = [...prev];
      updated[bitIndex] = updated[bitIndex] === 0 ? 1 : 0;
      const binaryStr = updated.join('');
      const hexVal = parseInt(binaryStr, 2).toString(16).toUpperCase();
      setSerialLogs(logs => [
        ...logs,
        `[REGISTER] Bit ${7 - bitIndex} toggled to ${updated[bitIndex]}. PORTA set to 0b${binaryStr} (0x${hexVal}).`
      ]);
      return updated;
    });
  };

  const clearSerialLogs = () => {
    setSerialLogs([
      `[SYSTEM] Terminal buffer cleared. Monitor active.`
    ]);
  };

  const triggerMockInterrupt = () => {
    setSerialLogs(logs => [
      ...logs,
      `[INTERRUPT] Asynchronous NVIC NEG_EDGE trigger detected on Pin 4.`,
      `[ISR] Suspending main loop task context...`,
      `[ISR] ISR handler PB_4_Callback completed in 12 T-states.`,
      `[SYSTEM] Restoring main execution thread.`
    ]);
  };

  // Video playback simulation state
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Assignment states
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);
  const [uploadingAssignment, setUploadingAssignment] = useState(false);

  // Q&A / Topic Discussion states
  const [comments, setComments] = useState<any[]>([
    { author: "Rahul Sharma", role: "STUDENT", text: "Is this compile-time optimization compatible with ARM Cortex-M0 systems?", date: "2 hours ago" },
    { author: "Amit Verma", role: "MENTOR", text: "Yes, but ensure you enable appropriate float-point compiler settings in your toolchain.", date: "1 hour ago" }
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const progressInfo = user?.progresses?.find((p: any) => p.courseId === id);
  const isCourseCompleted = progressInfo?.completed || false;
  
  const passingResults = user?.results?.filter((r: any) => r.courseId === id && r.passed) || [];
  const bestGrade = passingResults.length > 0 ? passingResults.reduce((prev: any, current: any) => (prev.accuracy > current.accuracy) ? prev : current).grade : null;

  useEffect(() => {
    const fetchSyllabus = async () => {
      setLoadingSyllabus(true);
      try {
        const res = await api.get('/courses');
        const courseModules = res.data[id as string] || [];
        setModules(courseModules);
      } catch (err) {
        console.error('Failed to fetch course syllabus:', err);
      } finally {
        setLoadingSyllabus(false);
      }
    };
    fetchSyllabus();
  }, [id]);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      setCheckingPayment(true);
      try {
        const res = await api.get(`/payments/status/${id}`);
        setIsPaid(res.data.paid);
      } catch (err) {
        console.error('Failed to fetch payment status:', err);
      } finally {
        setCheckingPayment(false);
      }
    };
    
    if (user) {
      fetchPaymentStatus();
    }
  }, [id, user]);

  useEffect(() => {
    if (isCourseCompleted && !checkingPayment) {
        setTimeout(() => {
            const el = document.getElementById('certification-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 800);
    }
  }, [isCourseCompleted, checkingPayment]);

  useEffect(() => {
    if (modules.length === 0) return;
    
    const fetchModuleDetails = async () => {
      setLoadingDetails(true);
      try {
        let activeModuleId = modules[activeModuleIndex]?.order || 1;
        const res = await api.get(`/courses/${id}/module/${activeModuleId}`);
        setActiveModuleDetail(res.data);
      } catch (err) {
        console.error('Lazy loading module failed, utilizing fallback dataset:', err);
        setActiveModuleDetail(modules[activeModuleIndex]);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchModuleDetails();
  }, [id, modules, activeModuleIndex]);

  const toggleModuleAccordion = (idx: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText("Copied!");
    setTimeout(() => setCopiedText(null), 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const handleMarkTopicCompleted = async () => {
    const currentTopicId = `${activeModuleIndex}-${activeTopicIndex}`;
    if (!readTopics.includes(currentTopicId)) {
      const newReadTopics = [...readTopics, currentTopicId];
      setReadTopics(newReadTopics);

      // Compute total topics seeded in modules
      let totalTopicsCount = 0;
      modules.forEach(m => {
        totalTopicsCount += m.topics?.length || 3; // Fallback to 3 if not loaded
      });

      // Calculate progress percentage
      const progressPercent = Math.min(Math.round((newReadTopics.length / totalTopicsCount) * 100), 100);
      
      try {
        // Sync course progress with backend
        await api.post(`/courses/progress`, {
          courseId: id,
          progress: progressPercent,
          completed: progressPercent === 100
        });

        // Trigger session profile update
        const meRes = await api.get('/auth/me');
        login("", meRes.data);

        if (progressPercent === 100) {
          confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
        }
      } catch (err) {
        console.error('Failed to sync course progress:', err);
      }
    }

    // Auto-advance to next topic or module
    const currentModule = activeModuleDetail || selectedModule;
    const currentTopicsLength = currentModule?.topics?.length || 3;

    if (activeTopicIndex < currentTopicsLength - 1) {
      setActiveTopicIndex(activeTopicIndex + 1);
    } else if (activeModuleIndex < modules.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
      setActiveTopicIndex(0);
      setExpandedModules(prev => ({ ...prev, [activeModuleIndex + 1]: true }));
    }
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase();
    
    if (code === 'SAVI10') {
      setDiscount(1);
      setIsCouponApplied(true);
    } else if (code === 'AVI050') {
      setDiscount(0.5);
      setIsCouponApplied(true);
    } else if (code === 'AVI030') {
      setDiscount(0.3);
      setIsCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code');
      setDiscount(0);
      setIsCouponApplied(false);
    }
  };

  const handleInitiatePayment = () => {
    setShowCheckoutModal(true);
  };

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleMockCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingCheckout(true);
    try {
      const orderRes = await api.post('/payments/create-order', {
        courseId: id,
        amount: currentPrice
      });

      const { realPayment, orderId, razorpayOrderId, razorpayKeyId, mockSignature } = orderRes.data;

      if (realPayment && razorpayOrderId) {
        const isSDKLoaded = await loadRazorpay();
        if (!isSDKLoaded) {
          alert('Failed to load Razorpay payment SDK.');
          setProcessingCheckout(false);
          return;
        }

        const options = {
          key: razorpayKeyId,
          amount: currentPrice * 100,
          currency: 'INR',
          name: 'Edunexus Labs',
          description: `Certified Specialization: ${id}`,
          order_id: razorpayOrderId,
          handler: async (response: any) => {
            setProcessingCheckout(true);
            try {
              const verifyRes = await api.post('/payments/verify', {
                orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.data.success) {
                setIsPaid(true);
                setShowCheckoutModal(false);
                await refreshUser();
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
              }
            } catch (err: any) {
              alert(err.response?.data?.message || 'Razorpay verification failed.');
            } finally {
              setProcessingCheckout(false);
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || ''
          },
          theme: { color: '#10b981' }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setProcessingCheckout(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const verifyRes = await api.post('/payments/verify', {
        orderId,
        mockSignature,
        gatewayReference: `REF_EDUNEXUS_MOCK_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        paymentDetails: { paymentMethod, cardNumber, cardExpiry, cardCvv }
      });

      if (verifyRes.data.success) {
        setIsPaid(true);
        setShowCheckoutModal(false);
        await refreshUser();
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Payment system clearance failed.');
    } finally {
      setProcessingCheckout(false);
    }
  };

  const handleUploadAssignment = async () => {
    setUploadingAssignment(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAssignmentSubmitted(true);
    setUploadingAssignment(false);
    confetti({ particleCount: 50, spread: 40 });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setComments([
      ...comments,
      { author: user?.name || "Student", role: user?.role || "STUDENT", text: newCommentText, date: "Just now" }
    ]);
    setNewCommentText('');
  };

  if (loadingSyllabus) {
    return (
      <div className="py-20 text-center space-y-4 bg-slate-950 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
        <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Loading dynamic curriculum console...</p>
      </div>
    );
  }

  const selectedModule = modules[activeModuleIndex];
  const activeTopic = activeModuleDetail?.topics?.[activeTopicIndex] || selectedModule?.topics?.[activeTopicIndex] || {
    title: "Core Concept Primer",
    text: "Select a topic from the curriculum sidebar to continue your learning deep dive.",
    code: null,
    note: null
  };

  // Aggregated progress calculations
  let totalTopics = 0;
  modules.forEach(m => totalTopics += m.topics?.length || 3);
  const completedPercentage = isCourseCompleted ? 100 : Math.min(Math.round((readTopics.length / totalTopics) * 100), 100);

  const BASE_PRICE = 999;
  const currentPrice = Math.round(BASE_PRICE * (1 - discount));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6 max-w-7xl mx-auto px-4 space-y-6 bg-slate-950 text-white min-h-screen font-sans"
    >
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-850 pb-4 gap-4">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="flex flex-wrap items-center gap-3">
          {isCourseCompleted && (
            <span className="text-xs uppercase tracking-widest text-emerald-450 font-black bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <CheckCircle size={14} /> Passed: {bestGrade}
            </span>
          )}
          <span className="text-xs uppercase tracking-widest text-slate-200 font-black bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shadow">
            Course ID: {id}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Syllabus Accordion Tree & Right GFG Interactive Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Accordion Tree Sidebar (4 Columns) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-850 rounded-3xl p-5 space-y-5 shadow-2xl shrink-0">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3 px-2">
            <h2 className="text-sm font-black tracking-widest uppercase text-slate-200">Syllabus Accordion</h2>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{completedPercentage}% Completed</span>
          </div>

          {/* Collapsible Syllabus Accordion */}
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {modules.map((mod, modIdx) => {
              const isExpanded = expandedModules[modIdx] || false;
              
              return (
                <div key={modIdx} className="border border-slate-850 rounded-2xl overflow-hidden bg-slate-950/40">
                  {/* Module Accordion Trigger */}
                  <button
                    onClick={() => toggleModuleAccordion(modIdx)}
                    className={`w-full flex items-center justify-between p-4 text-left transition-all ${isExpanded ? 'bg-slate-900/60 text-emerald-400' : 'text-slate-350 hover:bg-slate-900/30'}`}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen size={16} className={isExpanded ? 'text-emerald-400' : 'text-slate-500'} />
                      <div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Module {mod.order}</p>
                        <h4 className="text-xs font-black truncate max-w-[180px] mt-0.5">{mod.title}</h4>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {/* Expanded Nested Topics list */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-slate-950/60 border-t border-slate-900"
                      >
                        <div className="p-2 space-y-1">
                          {/* If dynamic topics don't exist yet, we list placeholders mapped to module order */}
                          {(mod.topics || Array.from({ length: 3 })).map((topic: any, topIdx: number) => {
                            const topicTitle = topic?.title || `Topic ${mod.order}.${topIdx + 1}: Foundations`;
                            const isTopicRead = readTopics.includes(`${modIdx}-${topIdx}`) || isCourseCompleted;
                            const isTopicActive = modIdx === activeModuleIndex && topIdx === activeTopicIndex;

                            return (
                              <button
                                key={topIdx}
                                onClick={() => {
                                  setActiveModuleIndex(modIdx);
                                  setActiveTopicIndex(topIdx);
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-[11px] font-bold flex items-center justify-between transition-all ${
                                  isTopicActive 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                                }`}
                              >
                                <span className="truncate max-w-[200px] flex items-center gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${isTopicRead ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                                  {topicTitle}
                                </span>
                                {isTopicRead && <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Timed Examination Entry */}
          <div className="pt-4 border-t border-slate-850">
            <button
              onClick={() => navigate(`/quiz/${id}`)}
              disabled={completedPercentage < 100 && !isCourseCompleted}
              className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 group ${
                completedPercentage === 100 || isCourseCompleted
                  ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/50 text-white hover:opacity-90 shadow shadow-emerald-500/10' 
                  : 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2.5 rounded-xl ${completedPercentage === 100 || isCourseCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900 text-slate-800'}`}>
                  {isCourseCompleted ? <Award size={18} /> : <TestTube size={18} />}
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black uppercase tracking-wide">Final Examination</h4>
                  <p className="text-[9px] font-bold text-slate-500 mt-0.5">{isCourseCompleted ? "Re-attempt Available" : "Score >70% to unlock Cert"}</p>
                </div>
              </div>
              {(completedPercentage === 100 || isCourseCompleted) && <Play size={14} className="text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Right Side: GFG Split Content Cockpit (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* A. Premium Video Tutorial Player */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-850 aspect-video shadow-2xl flex flex-col justify-center items-center group">
            {videoPlaying ? (
              // Simulated Interactive Video Playing Screen
              <div className="w-full h-full bg-slate-950 relative flex items-center justify-center">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Video Player"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
                <button
                  onClick={() => setVideoPlaying(false)}
                  className="absolute top-4 right-4 bg-slate-900/80 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-slate-800"
                >
                  Close Player
                </button>
              </div>
            ) : (
              // Stunning placeholder GFG-style poster
              <>
                <div className="absolute inset-0 bg-cover bg-center opacity-45 filter blur-[1px]" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2066')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                <div className="relative z-10 text-center space-y-4 px-6">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setVideoPlaying(true)}
                    className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 mx-auto hover:bg-emerald-450 transition-all duration-300"
                  >
                    <Play size={28} className="fill-slate-950 ml-1" />
                  </motion.button>
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Play Video Tutorial</p>
                  <h3 className="text-xl font-bold text-white max-w-lg mx-auto">{activeTopic.title}</h3>
                </div>
              </>
            )}
          </div>

          {/* B. Tabbed E-learning Content Console */}
          <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 shadow-2xl space-y-6">
            {/* Tab switch navigation */}
            <div className="flex gap-2 border-b border-slate-850 pb-2">
              {[
                { id: 'notes', label: 'Article / Notes', icon: FileText },
                { id: 'pdfs', label: 'PDF Handouts', icon: Award },
                { id: 'assignment', label: 'Assignment', icon: UploadCloud },
                { id: 'discussion', label: 'QA / Discussion', icon: MessageSquare }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeContentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveContentTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                      isActive 
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10' 
                        : 'text-slate-400 hover:text-white bg-slate-950/40'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content view based on active tab */}
            <div className="min-h-[30vh]">
              {activeContentTab === 'notes' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-100">{activeTopic.title}</h3>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Edunexus Verified Syllabus Handbook</p>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {activeTopic.text}
                  </p>

                  {/* Render topic code snippet if present */}
                  {activeTopic.code && (
                    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative group shadow-2xl">
                      <button
                        onClick={() => handleCopyCode(activeTopic.code)}
                        className="absolute right-3 top-3 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-350 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Clipboard size={14} />
                        {copiedText ? copiedText : 'Copy'}
                      </button>
                      <pre className="p-5 text-xs sm:text-sm font-mono text-cyan-300 overflow-x-auto select-all leading-relaxed">
                        <code>{activeTopic.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Render topic note if present */}
                  {activeTopic.note && (
                    <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-200/90 text-sm leading-relaxed flex items-start gap-4">
                      <span className="text-2xl leading-none">💡</span>
                      <div>
                        <strong className="text-amber-400 block mb-1 font-black tracking-wide uppercase text-[10px]">Takeaway Note</strong>
                        {activeTopic.note}
                      </div>
                    </div>
                  )}

                  {/* Interactive Edunexus Hardware Sandbox & Simulation Workbench (Electronics Category Only) */}
                  {coursesConfig.find(c => c.id === id)?.category === 'Electronics' && (
                    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-850 space-y-6 shadow-2xl relative overflow-hidden mt-8">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-850 pb-3 gap-2">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Cpu size={18} className="animate-pulse" />
                          <h4 className="text-xs font-black uppercase tracking-widest">Edunexus Hardware Sandbox</h4>
                        </div>
                        
                        <div className="flex gap-1.5 bg-slate-900 p-1 border border-slate-800 rounded-xl">
                          {(['pinout', 'console', 'register'] as const).map(tab => (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => setSandboxTab(tab)}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition ${
                                sandboxTab === tab ? 'bg-slate-950 text-white' : 'text-slate-450 hover:text-white'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* View Pinout Diagrams */}
                      {sandboxTab === 'pinout' && (
                        <div className="space-y-4 animate-in fade-in duration-250">
                          <p className="text-slate-450 text-xs">Hover or click on microchip pins to inspect physical alternate functions and register bindings.</p>
                          <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex justify-center items-center">
                            <div className="w-full max-w-sm border border-slate-800 p-4 rounded-xl bg-slate-950/60 font-mono text-[9px] text-slate-350 text-center space-y-2">
                              <p className="text-slate-500 border-b border-slate-900 pb-1.5 font-bold uppercase tracking-wider">▲ Microcontroller Core Pinout Map ▲</p>
                              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-left pt-2 font-black">
                                <div className="p-1 hover:bg-slate-900 rounded border border-transparent hover:border-emerald-500/20 cursor-pointer">1. [ VCC ] 5V Power Supply</div>
                                <div className="p-1 hover:bg-slate-900 rounded border border-transparent hover:border-emerald-500/20 cursor-pointer text-right">8. [ GND ] System Ground</div>
                                <div className="p-1 hover:bg-slate-900 rounded border border-transparent hover:border-emerald-500/20 cursor-pointer">2. [ A0  ] Analog Input 0 (ADC)</div>
                                <div className="p-1 hover:bg-slate-900 rounded border border-transparent hover:border-emerald-500/20 cursor-pointer text-right">7. [ D13 ] Onboard Pin 13 LED</div>
                                <div className="p-1 hover:bg-slate-900 rounded border border-transparent hover:border-emerald-500/20 cursor-pointer">3. [ PB8 ] I2C1 Serial Clock (SCL)</div>
                                <div className="p-1 hover:bg-slate-900 rounded border border-transparent hover:border-emerald-500/20 cursor-pointer text-right">6. [ PB9 ] I2C1 Serial Data (SDA)</div>
                                <div className="p-1 hover:bg-slate-900 rounded border border-transparent hover:border-emerald-500/20 cursor-pointer">4. [ PA0 ] Hardware PWM Timer 2</div>
                                <div className="p-1 hover:bg-slate-900 rounded border border-transparent hover:border-emerald-500/20 cursor-pointer text-right">5. [ PB4 ] NVIC External Interrupt</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* View Hardware simulated console logs */}
                      {sandboxTab === 'console' && (
                        <div className="space-y-4 animate-in fade-in duration-250">
                          <div className="flex justify-between items-center text-xs">
                            <p className="text-slate-450 text-[10px]">Real-time serial feedback monitor streamed from hardware core.</p>
                            <div className="flex gap-2">
                              <button type="button" onClick={triggerMockInterrupt} className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase rounded-lg border border-emerald-500/20">Trigger ISR</button>
                              <button type="button" onClick={clearSerialLogs} className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-[9px] font-black uppercase rounded-lg text-slate-305">Clear</button>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl font-mono text-[10px] text-emerald-400 min-h-[120px] max-h-[160px] overflow-y-auto space-y-1.5 shadow-inner">
                            {serialLogs.map((log, lIdx) => (
                              <div key={lIdx} className="leading-relaxed">
                                <span className="text-slate-700 shrink-0 mr-1.5">&gt;</span>
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* View Bitwise Register Configurator */}
                      {sandboxTab === 'register' && (
                        <div className="space-y-4 animate-in fade-in duration-250">
                          <p className="text-slate-450 text-xs">Configure an 8-bit output register (PORTA). Click bits to toggle state and compute HEX mask values.</p>
                          <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                              <span>8-Bit Grid Output (PORTA)</span>
                              <span className="text-emerald-400 font-mono">Hex Mask: 0x{parseInt(registerVal.join(''), 2).toString(16).toUpperCase()}</span>
                            </div>
                            
                            <div className="grid grid-cols-8 gap-2">
                              {registerVal.map((bit, bIdx) => (
                                <button
                                  key={bIdx}
                                  type="button"
                                  onClick={() => toggleRegisterBit(bIdx)}
                                  className={`aspect-square border rounded-xl flex flex-col justify-center items-center transition active:scale-95 ${
                                    bit === 1 
                                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow shadow-emerald-500/20' 
                                      : 'bg-slate-950 border-slate-800 text-slate-455 hover:border-slate-600'
                                  }`}
                                >
                                  <span className="text-[8px] font-black uppercase text-slate-500">B{7 - bIdx}</span>
                                  <span className="text-sm font-black mt-0.5">{bit}</span>
                                </button>
                              ))}
                            </div>

                            <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-[10px] text-slate-400 leading-relaxed font-bold">
                              {registerVal[5] === 1 ? (
                                <span className="text-emerald-400">💡 [LED ACTIVE] Bit 2 (PORTA2) is set to 1! The system drives Digital Pin 13 HIGH, successfully powering the onboard status LED.</span>
                              ) : (
                                <span>ℹ Set Bit 2 (PORTA2) to 1 to activate the simulated status LED on Pin 13. Toggling other bits adjusts alternate function configurations.</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mark completed checklist button */}
                  <div className="pt-6 border-t border-slate-850 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleMarkTopicCompleted}
                      className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-95 shadow active:scale-95"
                    >
                      <CheckCircle2 size={16} /> Mark Completed & Continue
                    </motion.button>
                  </div>
                </div>
              )}

              {activeContentTab === 'pdfs' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight">Accredited Reference Materials</h3>
                    <p className="text-slate-400 text-xs">Download professional reference sheets, notes, and handbook segments for {activeTopic.title}.</p>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/40 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <FileText className="text-emerald-400" size={32} />
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">{activeTopic.title} Segment.pdf</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Accredited handbook guide • 2.4 MB</p>
                      </div>
                    </div>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); alert('Simulated PDF Download triggered!'); }}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:text-emerald-400 text-slate-300 text-xs font-black uppercase rounded-xl transition"
                    >
                      Download PDF
                    </a>
                  </div>
                </div>
              )}

              {activeContentTab === 'assignment' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight">Module Tasks & Homework</h3>
                    <p className="text-slate-400 text-xs">Complete the practical tasks below and upload your solution package (PDF, zip, or source file).</p>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full tracking-wider">Required Task</span>
                      <h4 className="text-sm font-bold text-white pt-2">Task 1: Design and verify a modular loop framework for {activeTopic.title}.</h4>
                      <p className="text-xs text-slate-400 leading-relaxed pt-1">
                        Implement the procedural structures detailed in this module. Verify clock cycles, optimize variables mappings, and test dynamic outputs.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4">
                      {assignmentSubmitted ? (
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase">
                          <CheckCircle2 size={16} /> Assignment Submitted Successfully!
                        </div>
                      ) : (
                        <>
                          <p className="text-[10px] text-slate-500 font-bold">Files supported: .zip, .c, .cpp, .pdf • Max 5MB</p>
                          <button
                            onClick={handleUploadAssignment}
                            disabled={uploadingAssignment}
                            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
                          >
                            <UploadCloud size={14} /> 
                            {uploadingAssignment ? 'Uploading...' : 'Upload Solution'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeContentTab === 'discussion' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-2 border-b border-slate-850 pb-3">
                    <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight">Module Discussion Board</h3>
                    <p className="text-slate-400 text-xs">Clear doubts, discuss implementations, and review feedbacks with experts.</p>
                  </div>

                  {/* Comment list */}
                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
                    {comments.map((comment, cIdx) => (
                      <div key={cIdx} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-850 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-300 flex items-center gap-2">
                            {comment.author}
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${comment.role === 'MENTOR' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>{comment.role}</span>
                          </span>
                          <span className="text-[9px] text-slate-650">{comment.date}</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed font-medium pt-1">{comment.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* New comment input */}
                  <form onSubmit={handleAddComment} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Ask a question or share your comment..."
                      className="flex-1 px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition"
                    >
                      Post
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Certification Paywall Overlay */}
      {isCourseCompleted && !checkingPayment && (
        <motion.div 
          id="certification-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-10 rounded-3xl relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-emerald-500/20 shadow-2xl text-center"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {!isPaid ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left relative z-10">
              
              <div className="relative group/cert perspective-1000">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-50 pointer-events-none"></div>
                
                <div className="relative border-2 border-emerald-500/30 p-6 rounded-2xl bg-slate-950 aspect-[1.41/1] overflow-hidden flex flex-col justify-between items-center text-center filter blur-[2px] contrast-75 brightness-75 select-none pointer-events-none shadow-2xl">
                  <div className="text-[9px] tracking-widest text-slate-500 font-black uppercase">Edunexus Registry</div>
                  <div className="my-auto space-y-2 w-full px-8">
                    <h3 className="text-emerald-500 font-black text-lg uppercase tracking-widest border-b border-emerald-500/20 pb-2">Certificate of Accomplishment</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2">Awarded to</p>
                    <p className="text-2xl font-black text-white tracking-tight">{user?.name || "STUDENT NAME"}</p>
                    <p className="text-[9px] text-slate-400 max-w-[280px] leading-relaxed mx-auto font-medium">for demonstrating outstanding expertise and passing the rigorous final examination in deep technical domains.</p>
                  </div>
                  <div className="w-full flex justify-between items-center text-[8px] text-slate-500 px-4 font-mono font-bold">
                    <div>VERIFIED ID: HIDDEN</div>
                    <div>GRADE: {bestGrade}</div>
                  </div>
                </div>

                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                  <div className="px-6 py-3 bg-slate-950/80 backdrop-blur text-emerald-400 border border-emerald-500/50 rounded-2xl text-xs font-black tracking-widest uppercase rotate-[-8deg] shadow-2xl flex items-center gap-2">
                    <Lock size={16} /> Locked
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-left relative z-10">
                <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  Examination Passed
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">Claim Your Verified <br/>Credentials 🎓</h2>
                
                <p className="text-slate-300 text-sm leading-relaxed">
                  You conquered the curriculum and aced the final exam. Your ISO-compliant certificate with verifiable registry data is ready to be published.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 font-bold">
                  {[
                    "ISO 9001:2015 Accredited", 
                    "Verifiable Online Registry", 
                    "LinkedIn Shareable", 
                    "High-Res Printable"
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <Check size={16} className="text-emerald-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleInitiatePayment}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/10 text-xs uppercase tracking-widest"
                  >
                    Unlock Certificate (₹499)
                  </motion.button>
                  <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-black tracking-widest bg-slate-950 px-4 py-2 rounded-xl">
                    <ShieldAlert size={14} /> SSL Secured
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center relative z-10 space-y-6 py-8">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                <Sparkles size={40} className="animate-pulse" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Credentials Authorized!</h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                Your payment cleared successfully. Your secure certification credentials have been generated and entered into the registry.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/certificate?courseId=${id}`)}
                className="mt-4 px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-900/30 text-sm uppercase tracking-widest"
              >
                View High-Res Certificate
              </motion.button>
            </div>
          )}
        </motion.div>
      )}

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onSubmit={handleMockCheckoutSubmit}
        currentPrice={currentPrice}
        discount={discount}
        couponCode={couponCode}
        onChangeCouponCode={setCouponCode}
        onApplyCoupon={handleApplyCoupon}
        couponError={couponError}
        isCouponApplied={isCouponApplied}
        paymentMethod={paymentMethod}
        onChangePaymentMethod={setPaymentMethod}
        cardNumber={cardNumber}
        onChangeCardNumber={setCardNumber}
        cardExpiry={cardExpiry}
        onChangeCardExpiry={setCardExpiry}
        cardCvv={cardCvv}
        onChangeCardCvv={setCardCvv}
        processingCheckout={processingCheckout}
        upiCopied={upiCopied}
        onCopyToClipboard={copyToClipboard}
      />

    </motion.div>
  );
};

export default CourseDetail;