import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, Lock, BookOpen, Play, ArrowLeft, Clipboard, 
  CheckCircle2, ChevronRight, GraduationCap, Zap, Award, 
  Sparkles, CreditCard, ShieldAlert, Check, Eye, QrCode 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';

const CourseDetail = () => {
  const { id } = useParams(); // Course ID: e.g., 'C', 'C++', 'IoT', 'Embedded'
  const [weeks, setWeeks] = useState<any[]>([]);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [hasReadMaterial, setHasReadMaterial] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Dynamic performance lazy loading & cache states (Issue #9)
  const [loadingSyllabus, setLoadingSyllabus] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [activeModuleDetail, setActiveModuleDetail] = useState<any>(null);

  // Paywall checkout states (Issue #7)
  const [isPaid, setIsPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  
  // Checkout mock forms
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [upiCopied, setUpiCopied] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0); // 0 to 1 (e.g., 0.5 for 50%)
  const [couponError, setCouponError] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  
  // Image Lightbox zoom state (Issue #13)
  const [lightboxImage, setLightboxImage] = useState<React.ReactNode | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Find course-specific completed week progress from user state
  const progressInfo = user?.progresses?.find((p: any) => p.courseId === id);
  const currentWeek = progressInfo?.weekCompleted || 0; // 0 to 4

  // 1. Fetch Syllabus List (Saves initial course metadata directory)
  useEffect(() => {
    const fetchSyllabus = async () => {
      setLoadingSyllabus(true);
      try {
        const res = await api.get('/courses');
        const courseWeeks = res.data[id as string] || [];
        setWeeks(courseWeeks);
        
        // Default active week index based on user's current progress milestone
        const activeIndex = Math.min(currentWeek, 3);
        setActiveWeekIndex(activeIndex);
      } catch (err) {
        console.error('Failed to fetch course syllabus:', err);
      } finally {
        setLoadingSyllabus(false);
      }
    };
    fetchSyllabus();
  }, [id, currentWeek]);

  // 2. Fetch Payment Clearance Status (Issue #7)
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

  // 3. Lazy Load Module Details dynamically on Week navigation (Issue #9)
  useEffect(() => {
    if (weeks.length === 0) return;
    
    const fetchModuleDetails = async () => {
      setLoadingDetails(true);
      try {
        const activeWeekNum = weeks[activeWeekIndex]?.week || (activeWeekIndex + 1);
        
        // Dynamic dynamic lazy load call
        const res = await api.get(`/courses/${id}/module/${activeWeekNum}`);
        setActiveModuleDetail(res.data);
      } catch (err) {
        console.error('Lazy loading module failed, utilizing fallback dataset:', err);
        // Fallback safety to keep platform operational if API isn't fully migrated locally
        setActiveModuleDetail(weeks[activeWeekIndex]);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchModuleDetails();
  }, [id, weeks, activeWeekIndex]);

  const handleCopyCode = (code: string, topicIndex: number) => {
    navigator.clipboard.writeText(code);
    setCopiedText(`${topicIndex}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const BASE_PRICE = 499;
  const currentPrice = Math.round(BASE_PRICE * (1 - discount));

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

  // Mock Payment triggers
  const handleInitiatePayment = () => {
    setShowCheckoutModal(true);
  };

  const handleMockCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPrice > 0 && paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      alert('Please fill out all credentials to capture mock payment!');
      return;
    }

    setProcessingCheckout(true);
    try {
      // 1. Backend: Initialize order (Issue #3)
      const orderRes = await api.post('/payments/create-order', {
        courseId: id,
        amount: currentPrice
      });

      const { orderId, mockSignature } = orderRes.data;

      // Simulate a small network latency
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 2. Backend: Secure cryptographic webhook signature verification (Issue #3, #4)
      // eslint-disable-next-line react-hooks/purity
      const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
      let gatewayRef = '';
      if (currentPrice === 0) {
        gatewayRef = `REF_COUPON_FREE_${randomSuffix}`;
      } else {
        gatewayRef = paymentMethod === 'card' 
          ? `REF_MOCK_CARD_${randomSuffix}`
          : `REF_MOCK_UPI_${randomSuffix}`;
      }

      const verifyRes = await api.post('/payments/verify', {
        orderId,
        mockSignature,
        gatewayReference: gatewayRef
      });

      if (verifyRes.data.success) {
        setIsPaid(true);
        setShowCheckoutModal(false);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      console.error('Checkout verification failed:', err);
      alert(err.response?.data?.message || 'Payment system clearance failed. Please try again.');
    } finally {
      setProcessingCheckout(false);
    }
  };

  // Concept Infographic Blueprint Renderer (Issue #13)
  const renderWeeklyDiagram = (courseKey: string, weekNum: number) => {
    const strokeColor = "#22d3ee"; // cyan-400
    const accentColor = "#3b82f6"; // blue-500
    const textTheme = "fill-slate-300 font-sans text-[11px] font-bold text-center";
    
    // C Programming Track SVG Blueprints
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
    
    // Fallback vector outline for other weeks/courses (Sleek generic architecture circuit map)
    return (
      <svg viewBox="0 0 320 200" className="w-full h-auto max-h-[160px]">
        <circle cx="60" cy="100" r="30" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
        <text x="60" y="104" textAnchor="middle" className="fill-white text-[9px] font-black">{courseKey} Micro</text>
        
        <path d="M 90 100 L 150 100" stroke={strokeColor} strokeWidth="2" />
        <rect x="150" y="75" width="80" height="50" rx="8" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
        <text x="190" y="104" textAnchor="middle" className="fill-cyan-400 text-[10px] font-bold">Registers</text>
        
        <path d="M 230 100 L 280 100" stroke={strokeColor} strokeWidth="2" />
        <circle cx="290" cy="100" r="10" fill="#10b981" />
        <text x="190" y="50" textAnchor="middle" className="fill-amber-400 text-[9px] font-black">Week {weekNum} Logic Flow</text>
      </svg>
    );
  };

  if (loadingSyllabus) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
        <p className="text-slate-400 text-sm font-semibold">Decrypting curriculum syllabus registry...</p>
      </div>
    );
  }

  const selectedWeek = weeks[activeWeekIndex];

  // Calculate circular progress metrics for the sidebar
  const completedPercentage = Math.min(Math.round(((progressInfo?.weekCompleted || 0) / 4) * 100), 100);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completedPercentage / 100) * circumference;

  // Calculate estimated reading time
  const wordCount = selectedWeek?.description?.split(/\s+/).length + (activeModuleDetail?.topics?.reduce((acc: number, t: any) => acc + (t.text?.split(/\s+/).length || 0), 0) || 0);
  const readingTime = Math.max(Math.ceil(wordCount / 180), 1);

  return (
    <div className="py-6 max-w-6xl mx-auto px-4 space-y-6">
      
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold"
        >
          <ArrowLeft size={16} /> Back to Tracks
        </button>
        <div className="flex items-center gap-2">
          <GraduationCap className="text-blue-400" size={20} />
          <span className="text-xs uppercase tracking-widest text-slate-350 font-bold bg-slate-800 px-3 py-1 rounded-full border border-slate-700/60">
            {id} Training Track
          </span>
        </div>
      </div>

      {/* Main Split-Screen Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Column: Weekly Modules Sidebar */}
        <div className="w-full lg:w-1/3 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-3.5 shrink-0">
          <h2 className="text-lg font-extrabold tracking-tight px-2 pb-2 border-b border-slate-800">Weekly Modules</h2>
          
          {/* Circular Progress Widget in Sidebar */}
          <div className="flex items-center gap-3.5 p-3 bg-slate-900/60 border border-slate-800/85 rounded-xl shadow-inner">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r={radius}
                  className="text-slate-800"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r={radius}
                  className="text-cyan-400 transition-all duration-750 ease-out animate-pulse-slow"
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[9px] font-black text-white">{completedPercentage}%</span>
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">Track Progress</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{progressInfo?.weekCompleted || 0} of 4 Modules Completed</p>
            </div>
          </div>
          
          <div className="space-y-2.5">
            {weeks.map((week, index) => {
              const isUnlocked = index <= currentWeek;
              const isCompleted = index < currentWeek;
              const isActive = index === activeWeekIndex;
              
              return (
                <button
                  key={index}
                  disabled={!isUnlocked}
                  onClick={() => {
                    setActiveWeekIndex(index);
                    setHasReadMaterial(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 group ${
                    isActive 
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/5' 
                      : isUnlocked 
                        ? 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600' 
                        : 'bg-slate-950/20 border-slate-900 text-slate-500 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : isUnlocked 
                          ? 'bg-slate-700/50 text-slate-400' 
                          : 'bg-slate-800 text-slate-600'
                     }`}>
                      {isCompleted ? <CheckCircle size={18} className="text-emerald-400" /> : isUnlocked ? <BookOpen size={18} /> : <Lock size={18} />}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Week {week.week}</p>
                      <h4 className="text-sm font-bold truncate max-w-[170px]">{week.title}</h4>
                    </div>
                  </div>
                  {isUnlocked && <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic E-Learning Viewer Console */}
        <div className="flex-1 w-full bg-slate-900/30 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
          
          {loadingDetails ? (
            /* Shimmering glassmorphism loading skeleton (Issue #9) */
            <div className="space-y-6 animate-pulse py-4">
              <div className="flex gap-2">
                <div className="h-6 w-32 bg-slate-800 rounded"></div>
                <div className="h-6 w-20 bg-slate-800 rounded"></div>
              </div>
              <div className="h-8 w-2/3 bg-slate-800 rounded"></div>
              <div className="h-4 w-full bg-slate-800 rounded"></div>
              <div className="h-4 w-5/6 bg-slate-800 rounded"></div>
              
              <div className="space-y-6 pt-10 border-t border-slate-850">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-3 pl-8 relative">
                    <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-slate-800"></div>
                    <div className="h-6 w-40 bg-slate-800 rounded"></div>
                    <div className="h-4 w-full bg-slate-800 rounded"></div>
                    <div className="h-24 w-full bg-slate-850 rounded-xl"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWeekIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Header block */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="inline-block text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded">
                      Module {selectedWeek.week} Study Material
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">
                      ⏱ {readingTime} Min Read
                    </div>
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-white">{selectedWeek.title}</h2>
                  <p className="text-slate-400 text-sm mt-1">{selectedWeek.description}</p>
                </div>

                {/* Curriculum Topics List */}
                <div className="space-y-8 pt-4 border-t border-slate-800/80">
                  {activeModuleDetail?.topics?.map((topic: any, idx: number) => (
                    <div key={idx} className="space-y-3.5 group">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-slate-200 tracking-tight group-hover:text-white transition">
                          {topic.title}
                        </h3>
                      </div>
                      
                      <p className="text-slate-300 text-sm leading-relaxed pl-8">
                        {topic.text}
                      </p>

                      {/* Highly aesthetic code blocks with copy features */}
                      {topic.code && (
                        <div className="ml-8 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/60 relative group/code shadow-inner">
                          <button
                            onClick={() => handleCopyCode(topic.code, idx)}
                            className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1.5 opacity-0 group-hover/code:opacity-100 focus:opacity-100"
                            title="Copy Code"
                          >
                            <Clipboard size={14} />
                            {copiedText === `${idx}` ? 'Copied!' : 'Copy'}
                          </button>
                          <pre className="p-4 text-xs font-mono text-cyan-400 overflow-x-auto select-all leading-relaxed">
                            <code>{topic.code}</code>
                          </pre>
                        </div>
                      )}

                      {/* Highlighted core takeaways / notes */}
                      {topic.note && (
                        <div className="ml-8 p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-300 text-xs leading-relaxed flex items-start gap-3">
                          <span className="text-lg leading-none select-none">💡</span>
                          <div>
                            <strong className="text-teal-200 block mb-0.5">Core Takeaway</strong>
                            {topic.note}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Concept Visualized Blueprint (Issue #13) */}
                <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 ml-8">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Zap size={18} className="animate-pulse" />
                    <h4 className="text-xs font-black uppercase tracking-widest">Concept Visualized Blueprint</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2 text-slate-350 text-xs leading-relaxed">
                      <p className="font-bold text-slate-200">Interactive Blueprint Visualization</p>
                      <p>Study this visual schematic representation of the concepts introduced this week. Click on the infographic mapping diagram to zoom in for detailed viewing.</p>
                      <button 
                        onClick={() => setLightboxImage(renderWeeklyDiagram(id as string, selectedWeek.week))}
                        className="flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-400 hover:text-white font-extrabold uppercase rounded text-[9px] border border-slate-700/60 transition active:scale-[0.98]"
                      >
                        <Eye size={12} /> Click Diagram to Expand
                      </button>
                    </div>
                    <div 
                      onClick={() => setLightboxImage(renderWeeklyDiagram(id as string, selectedWeek.week))}
                      className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/80 hover:bg-slate-950/20 hover:border-slate-700 transition duration-300 cursor-pointer flex justify-center items-center group shadow-md"
                    >
                      <div className="transform group-hover:scale-[1.02] transition duration-300 w-full max-w-[280px]">
                        {renderWeeklyDiagram(id as string, selectedWeek.week)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lock / Quiz Unlocking Control Console */}
                <div className="mt-10 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Module Verification</h4>
                  
                  {activeWeekIndex < currentWeek ? (
                    /* Module already passed */
                    <div className="flex items-center gap-3 text-emerald-400">
                      <CheckCircle2 size={24} />
                      <div>
                        <p className="text-sm font-bold">Week {selectedWeek.week} Completed successfully!</p>
                        <p className="text-xs text-slate-400">You passed the quiz for this week. You can re-take it to improve your score if desired.</p>
                      </div>
                      <button 
                        onClick={() => navigate(`/quiz/${id}/${selectedWeek.week}`)}
                        className="ml-auto text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-slate-300 font-semibold transition"
                      >
                        Retry Quiz
                      </button>
                    </div>
                  ) : activeWeekIndex === currentWeek ? (
                    /* Current week to learn and pass */
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer group text-xs text-slate-400 select-none">
                        <input 
                          type="checkbox"
                          checked={hasReadMaterial}
                          onChange={(e) => setHasReadMaterial(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-cyan-600 rounded bg-slate-800 border-slate-700 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer"
                        />
                        <span className="group-hover:text-slate-200 transition leading-tight">
                          I have read and understood all the study concepts for Week {selectedWeek.week} of this track. I am ready to attempt the quiz.
                        </span>
                      </label>

                      <button 
                        disabled={!hasReadMaterial}
                        onClick={() => navigate(`/quiz/${id}/${selectedWeek.week}`)}
                        className={`w-full py-3 rounded-xl font-extrabold text-sm transition flex items-center justify-center gap-2 text-white shadow-lg active:scale-[0.99] ${
                          hasReadMaterial
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-cyan-500/20'
                            : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed opacity-50 shadow-none'
                        }`}
                      >
                        <Play size={16} /> Unlock & Start Week {selectedWeek.week} Quiz
                      </button>
                    </div>
                  ) : (
                    /* Fully locked module */
                    <div className="flex items-center gap-3 text-slate-500 text-xs">
                      <Lock size={18} />
                      <span>Complete Week {currentWeek + 1} quiz to unlock the subsequent learning materials.</span>
                    </div>
                  )}
                </div>

                {/* Navigation controls at the bottom of content */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-800/80 mt-10">
                  <button
                    disabled={activeWeekIndex === 0}
                    onClick={() => {
                      setActiveWeekIndex(activeWeekIndex - 1);
                      setHasReadMaterial(false);
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-[0.98] ${
                      activeWeekIndex === 0
                        ? 'border-slate-900 text-slate-700 cursor-not-allowed opacity-30 bg-transparent'
                        : 'border-slate-800 hover:border-slate-700 text-slate-355 hover:text-white bg-slate-950/40 hover:bg-slate-950/60 shadow-sm'
                    }`}
                  >
                    ← Prev Module
                  </button>
                  
                  <button
                    disabled={activeWeekIndex >= Math.min(currentWeek, 3)}
                    onClick={() => {
                      setActiveWeekIndex(activeWeekIndex + 1);
                      setHasReadMaterial(false);
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-[0.98] ${
                      activeWeekIndex >= Math.min(currentWeek, 3)
                        ? 'border-slate-900 text-slate-700 cursor-not-allowed opacity-30 bg-transparent'
                        : 'border-slate-800 hover:border-slate-700 text-slate-355 hover:text-white bg-slate-950/40 hover:bg-slate-950/60 shadow-sm'
                    }`}
                  >
                    Next Module →
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Golden Accreditation Certificate Paywall / Access Panel (Issue #3 & #7) */}
      {currentWeek >= 4 && !checkingPayment && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-10 p-8 rounded-2xl relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-yellow-500/30 shadow-xl shadow-yellow-500/5"
        >
          {/* Sparkles background */}
          <div className="absolute top-3 left-4 text-yellow-500/5 text-7xl select-none font-serif">★</div>
          <div className="absolute bottom-3 right-4 text-yellow-500/5 text-7xl select-none font-serif">★</div>

          {!isPaid ? (
            /* Premium Golden Paywall Landing Screen (Issue #7) */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              
              {/* Left Side: Blurred / Watermarked Certificate Mockup */}
              <div className="relative group/cert select-none">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 rounded-xl blur-lg opacity-60 group-hover/cert:opacity-90 transition duration-500"></div>
                
                {/* Visual Certificate Frame */}
                <div className="relative border-4 border-yellow-500/40 p-4 rounded-xl bg-slate-900 aspect-[1.41/1] overflow-hidden flex flex-col justify-between items-center text-center filter blur-[4px] contrast-75 brightness-75 select-none pointer-events-none">
                  <div className="text-[7px] tracking-widest text-slate-500 font-extrabold uppercase">Nexus Academic Credentials</div>
                  <div className="my-auto space-y-1">
                    <h3 className="text-yellow-500/60 font-serif font-black text-sm uppercase tracking-wide">Certificate of Accomplishment</h3>
                    <p className="text-[8px] text-slate-400">Awarded to the candidate</p>
                    <p className="text-xs font-bold text-white tracking-tight underline underline-offset-4">{user?.name || "STUDENT NAME"}</p>
                    <p className="text-[6px] text-slate-500 max-w-[200px] leading-tight mx-auto">for completing the intensive training curriculum in C & Embedded Systems Hardware tracks.</p>
                  </div>
                  <div className="w-full flex justify-between items-center text-[5px] text-slate-650 px-2 font-mono">
                    <div>DATE: 2026-05-29</div>
                    <div>GRADE: A+</div>
                  </div>
                </div>

                {/* Giant Diagonal Diagonal Provisional Watermark Overlay */}
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded text-[9px] font-black tracking-widest uppercase rotate-[-12deg] shadow-lg shadow-black/80">
                    Provisional Preview - Locked 🔒
                  </span>
                </div>
              </div>

              {/* Right Side: Accreditations, Value Proposition & CTA Checkout */}
              <div className="space-y-5 text-left">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Award size={24} className="animate-bounce" />
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">Unlock Your Verified Certificate 🎓</h2>
                </div>
                
                <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
                  Congratulations! You have completed all course curriculum modules and passed the final examinations. Your credential is ready to be authorized and published.
                </p>

                {/* Value Propositions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300 font-bold bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex items-start gap-2.5">
                    <Check size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                    <span>ISO 9001:2015 Accredited Standards</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                    <span>Verifiable Online Registry Entry</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                    <span>One-Click Shareable to LinkedIn</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                    <span>Durable High-Res Printable Format</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button 
                    onClick={handleInitiatePayment}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/25 transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-xs uppercase tracking-widest"
                  >
                    Unlock Official Credentials (₹499)
                  </button>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <ShieldAlert size={14} /> Encrypted Gateway
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Successful Checkout Celebration Presentation State */
            <div className="text-center relative z-10 space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <Sparkles size={32} className="animate-spin-slow" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 tracking-tight">Credentials Verified & Active! 🎓</h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                Thank you! Your payment cleared successfully and your secure certification credentials have been generated. You can now download, print, or share your ISO-compliant certificate.
              </p>
              <button 
                onClick={() => navigate(`/certificate?courseId=${id}`)}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-yellow-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                Open High-Resolution Certificate
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Interactive Lightbox Infographic Zoom Modal (Issue #13) */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-950/70 border border-slate-800 p-8 rounded-2xl w-full max-w-2xl aspect-[1.5/1] relative shadow-2xl flex flex-col justify-center items-center"
            >
              <button 
                onClick={() => setLightboxImage(null)}
                className="absolute right-4 top-4 text-xs font-bold text-slate-500 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition"
              >
                Close ✕
              </button>
              
              <div className="w-full h-full max-w-[500px] flex items-center justify-center">
                {lightboxImage}
              </div>
              
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4">
                Interactive Technical Blueprint - Concept Visualized
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stripe/Razorpay Sleek Mock Checkout Modal (Issue #7 & #3) */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-6 relative"
            >
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="absolute right-4 top-4 text-slate-500 hover:text-white transition"
              >
                ✕
              </button>

              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-cyan-400 text-sm font-extrabold uppercase tracking-widest">
                  <CreditCard size={18} /> Nexus Billing checkout
                </div>
                <h3 className="text-lg font-black text-white">Complete Certificate Payment</h3>
                <p className="text-xs text-slate-400">Mock Stripe-Razorpay Sandbox Payment Portal</p>
              </div>

              <form onSubmit={handleMockCheckoutSubmit} className="space-y-4">
                
                {/* Amount Box */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase">Acceridatión Fee</span>
                  <div className="flex flex-col items-end">
                    {discount > 0 && (
                      <span className="text-slate-500 line-through text-[10px]">₹499.00</span>
                    )}
                    <span className="text-cyan-400 font-black text-sm">₹{currentPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Discount Coupon</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition font-mono uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] font-bold uppercase rounded-xl border border-slate-700 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[9px] text-red-500 font-bold ml-1">{couponError}</p>}
                  {isCouponApplied && <p className="text-[9px] text-green-500 font-bold ml-1">Coupon Applied: {Math.round(discount * 100)}% OFF!</p>}
                </div>

                {currentPrice > 0 ? (
                  <>
                    {/* Payment Method Selector */}
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${paymentMethod === 'card' ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        <CreditCard size={14} /> Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${paymentMethod === 'upi' ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        <QrCode size={14} /> UPI / QR
                      </button>
                    </div>

                    {paymentMethod === 'card' ? (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Card Number (Mock Input)</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              required
                              placeholder="4111 2222 3333 4444"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition font-mono"
                            />
                            <CreditCard size={16} className="absolute right-3.5 top-3 text-slate-500" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1 text-left">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Expiry Date</label>
                            <input 
                              type="text" 
                              required
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition font-mono"
                            />
                          </div>
                          <div className="space-y-1 text-left">
                            <label className="text-[10px] uppercase font-bold text-slate-400">CVV / CVC</label>
                            <input 
                              type="password" 
                              required
                              placeholder="•••"
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl">
                          <QRCodeSVG 
                            value={`upi://pay?pa=avinashkunwar07@ptyes&pn=Gaurav%20Singh&am=${currentPrice}&cu=INR`} 
                            size={160}
                            level="H"
                            includeMargin={true}
                          />
                          <p className="text-slate-900 text-[10px] font-black uppercase tracking-tighter mt-2">Scan to pay ₹{currentPrice} with UPI</p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Payee Name</label>
                          <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold">
                            Gaurav Singh
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400">UPI ID</label>
                          <div className="relative">
                            <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono">
                              avinashkunwar07@ptyes
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard('avinashkunwar07@ptyes')}
                              className="absolute right-2 top-1.5 p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition"
                            >
                              {upiCopied ? <Check size={14} /> : <Clipboard size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex flex-col items-center justify-center space-y-3 animate-in zoom-in-95 duration-300">
                    <Sparkles className="text-cyan-400 animate-pulse" size={32} />
                    <div className="text-center">
                      <p className="text-white font-black uppercase text-sm">Full Discount Applied!</p>
                      <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">Your certificate is now completely free.</p>
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={processingCheckout}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-800 disabled:to-slate-800 text-white font-extrabold rounded-xl shadow-lg shadow-cyan-500/10 transition duration-200 text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {processingCheckout ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{currentPrice === 0 ? 'Applying Free Clearance...' : (paymentMethod === 'card' ? 'Authorizing Sandbox Charge...' : 'Verifying UPI Transaction...')}</span>
                    </>
                  ) : (
                    <>
                      <span>{currentPrice === 0 ? 'Claim Free Certificate' : (paymentMethod === 'card' ? `Pay ₹${currentPrice} Clearance Fee` : 'I have completed the payment')}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider pt-2 border-t border-slate-900">
                🔒 Secured with 256-bit TLS Webhook Verification
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CourseDetail;
