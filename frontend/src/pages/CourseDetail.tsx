import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, Lock, BookOpen, Play, ArrowLeft, Clipboard, 
  CheckCircle2, ChevronRight, Zap, Award, 
  Sparkles, ShieldAlert, Check, Eye, TestTube
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckoutModal } from '../components/course/CheckoutModal';
import { ModuleBlueprintSVG } from '../components/course/ModuleBlueprintSVG';

const CourseDetail = () => {
  const { id } = useParams();
  const [modules, setModules] = useState<any[]>([]);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [readModules, setReadModules] = useState<number[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  const [loadingSyllabus, setLoadingSyllabus] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [activeModuleDetail, setActiveModuleDetail] = useState<any>(null);

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
  
  const [lightboxImage, setLightboxImage] = useState<React.ReactNode | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

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
        const res = await api.get(`/payments/status/\${id}`);
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
    if (modules.length === 0) return;
    
    const fetchModuleDetails = async () => {
      setLoadingDetails(true);
      try {
        let activeModuleId = modules[activeModuleIndex]?.order || 1;
        const res = await api.get(`/courses/\${id}/module/\${activeModuleId}`);
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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(`\${topicIndex}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const handleMarkModuleRead = () => {
    if (!readModules.includes(activeModuleIndex)) {
        setReadModules([...readModules, activeModuleIndex]);
    }
    if (activeModuleIndex < modules.length - 1) {
        setActiveModuleIndex(activeModuleIndex + 1);
    }
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
    if (currentPrice > 0 && paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      alert('Please fill out all credentials to capture mock payment!');
      return;
    }

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
          alert('Failed to load Razorpay payment SDK. Please verify your internet connection.');
          setProcessingCheckout(false);
          return;
        }

        const options = {
          key: razorpayKeyId,
          amount: currentPrice * 100, // paise
          currency: 'INR',
          name: 'Nexus Institute of Technology',
          description: `Certified Specialization: \${id}`,
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
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
              }
            } catch (err: any) {
              console.error(err);
              alert(err.response?.data?.message || 'Razorpay payment verification failed.');
            } finally {
              setProcessingCheckout(false);
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || ''
          },
          theme: { color: '#4f46e5' }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setProcessingCheckout(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));

      let randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
      let gatewayRef = '';
      if (currentPrice === 0) {
        gatewayRef = `REF_COUPON_FREE_\${randomSuffix}`;
      } else {
        gatewayRef = paymentMethod === 'card' 
          ? `REF_MOCK_CARD_\${randomSuffix}`
          : `REF_MOCK_UPI_\${randomSuffix}`;
      }

      const verifyRes = await api.post('/payments/verify', {
        orderId,
        mockSignature,
        gatewayReference: gatewayRef,
        paymentDetails: { paymentMethod, cardNumber, cardExpiry, cardCvv }
      });

      if (verifyRes.data.success) {
        setIsPaid(true);
        setShowCheckoutModal(false);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      console.error('Checkout verification failed:', err);
      alert(err.response?.data?.message || 'Payment system clearance failed. Please try again.');
    } finally {
      setProcessingCheckout(false);
    }
  };

  if (loadingSyllabus) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-slate-400 text-sm font-semibold">Loading deep curriculum structure...</p>
      </div>
    );
  }

  const selectedModule = modules[activeModuleIndex];
  const allModulesRead = readModules.length === modules.length || isCourseCompleted;
  const completedPercentage = isCourseCompleted ? 100 : Math.min(Math.round((readModules.length / (modules.length || 1)) * 100), 100);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completedPercentage / 100) * circumference;

  const wordCount = selectedModule?.description?.split(/\s+/).length + (activeModuleDetail?.topics?.reduce((acc: number, t: any) => acc + (t.text?.split(/\s+/).length || 0), 0) || 0);
  const readingTime = Math.max(Math.ceil(wordCount / 180), 1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6 max-w-7xl mx-auto px-4 space-y-6"
    >
      
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-bold"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="flex items-center gap-3">
          {isCourseCompleted && (
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle size={14} /> Passed: {bestGrade}
            </span>
          )}
          <span className="text-xs uppercase tracking-widest text-slate-350 font-black bg-slate-800 px-3 py-1 rounded-full border border-slate-700/60">
            {id}
          </span>
        </div>
      </div>

      {/* Main Split-Screen Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Column: Modules Sidebar */}
        <div className="w-full lg:w-1/3 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 space-y-5 shrink-0 shadow-2xl">
          <h2 className="text-lg font-black tracking-widest uppercase text-slate-200 px-2 border-b border-slate-800 pb-3">Curriculum</h2>
          
          {/* Circular Progress Widget in Sidebar */}
          <div className="flex items-center gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl shadow-inner">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r={radius} className="text-slate-800" strokeWidth="4" stroke="currentColor" fill="transparent" />
                <circle
                  cx="28" cy="28" r={radius}
                  className="text-blue-500 transition-all duration-1000 ease-out"
                  strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent"
                />
              </svg>
              <span className="absolute text-[10px] font-black text-white">{completedPercentage}%</span>
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest">Study Progress</h3>
              <p className="text-[10px] font-bold text-slate-500 mt-1">{readModules.length} of {modules.length} Modules Read</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {modules.map((mod, index) => {
              const isRead = readModules.includes(index) || isCourseCompleted;
              let isActive = index === activeModuleIndex;
              
              return (
                <button
                  key={index}
                  onClick={() => setActiveModuleIndex(index)}
                  className={`w-full text-left p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 group \${
                    isActive 
                      ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-lg shadow-blue-900/20' 
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl transition-colors \${
                      isActive ? 'bg-blue-500/20 text-blue-400' : isRead ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-900 text-slate-500'
                     }`}>
                      {isRead ? <CheckCircle size={18} /> : <BookOpen size={18} />}
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Module {mod.order}</p>
                      <h4 className="text-sm font-bold truncate max-w-[150px] mt-0.5">{mod.title}</h4>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Final Exam Section Button */}
          <div className="pt-4 border-t border-slate-800">
             <button
                onClick={() => navigate(`/quiz/\${id}`)}
                disabled={!allModulesRead && !isCourseCompleted}
                className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 group \${
                  allModulesRead || isCourseCompleted
                    ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/50 text-white hover:from-amber-500/20 hover:to-orange-500/20 shadow-lg shadow-amber-900/20' 
                    : 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl transition-colors \${
                    allModulesRead || isCourseCompleted ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-900 text-slate-700'
                   }`}>
                    {isCourseCompleted ? <Award size={18} /> : allModulesRead ? <TestTube size={18} /> : <Lock size={18} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wide">Final Examination</h4>
                    <p className="text-[9px] font-bold text-slate-500 mt-0.5">{isCourseCompleted ? "Re-attempt Available" : allModulesRead ? "Unlocked" : "Read all modules to unlock"}</p>
                  </div>
                </div>
                {(allModulesRead || isCourseCompleted) && <Play size={16} className="text-amber-400" />}
             </button>
          </div>
        </div>

        {/* Right Column: E-Learning Viewer Console */}
        <div className="flex-1 w-full bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 lg:p-10 shadow-2xl relative overflow-hidden">
          
          {loadingDetails ? (
            <div className="space-y-6 animate-pulse py-4">
              <div className="h-8 w-1/3 bg-slate-800 rounded-lg"></div>
              <div className="h-12 w-3/4 bg-slate-800 rounded-xl"></div>
              <div className="space-y-4 pt-10">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-6 w-40 bg-slate-800 rounded-lg"></div>
                    <div className="h-24 w-full bg-slate-800/50 rounded-xl"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModuleIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Header block */}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="inline-block text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg">
                      Module {selectedModule?.order}
                    </div>
                    <div className="text-[10px] font-black text-slate-400 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                      ⏱ {readingTime} Min Read
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    {selectedModule?.title}
                  </h2>
                  <p className="text-slate-400 text-sm md:text-base mt-4 leading-relaxed max-w-3xl">
                    {selectedModule?.description}
                  </p>
                </div>

                {/* Curriculum Topics List */}
                <div className="space-y-12 pt-8 border-t border-slate-800/80">
                  {activeModuleDetail?.topics?.map((topic: any, idx: number) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      key={idx} 
                      className="space-y-4 group"
                    >
                      <div className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center text-sm font-black shrink-0 mt-1">
                          {idx + 1}
                        </span>
                        <div className="space-y-2 flex-1">
                          <h3 className="text-xl font-bold text-slate-100 tracking-tight group-hover:text-blue-400 transition-colors">
                            {topic.title}
                          </h3>
                          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {topic.text}
                          </p>
                        </div>
                      </div>

                      {topic.code && (
                        <div className="ml-12 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 relative group/code shadow-2xl">
                          <button
                            onClick={() => handleCopyCode(topic.code)}
                            className="absolute right-3 top-3 p-2 rounded-xl bg-slate-800/80 backdrop-blur border border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 opacity-0 group-hover/code:opacity-100 focus:opacity-100 hover:scale-105"
                          >
                            <Clipboard size={14} />
                            {copiedText === `\${idx}` ? 'Copied!' : 'Copy'}
                          </button>
                          <pre className="p-5 text-sm font-mono text-blue-300 overflow-x-auto select-all leading-relaxed">
                            <code>{topic.code}</code>
                          </pre>
                        </div>
                      )}

                      {topic.note && (
                        <div className="ml-12 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-200/90 text-sm leading-relaxed flex items-start gap-4 shadow-inner">
                          <span className="text-2xl leading-none select-none">💡</span>
                          <div>
                            <strong className="text-amber-400 block mb-1 font-black tracking-wide uppercase text-[10px]">Core Takeaway</strong>
                            {topic.note}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Concept Visualized Blueprint */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden mt-12">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                  <div className="flex items-center gap-3 text-blue-400 relative z-10">
                    <Zap size={20} className="animate-pulse" />
                    <h4 className="text-xs font-black uppercase tracking-widest">Concept Architecture</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
                    <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                      <p className="font-bold text-white text-base">Interactive Visualization</p>
                      <p>Study this schematic representation of the concepts introduced in this module. Visualizing the architecture solidifies your deep understanding.</p>
                      <button 
                        onClick={() => setLightboxImage(<ModuleBlueprintSVG courseKey={id as string} weekNum={selectedModule?.order || 1} />)}
                        className="flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase rounded-xl text-[10px] tracking-wider transition-transform active:scale-95 shadow-lg shadow-blue-900/50"
                      >
                        <Eye size={14} /> Expand Diagram
                      </button>
                    </div>
                    <div 
                      onClick={() => setLightboxImage(<ModuleBlueprintSVG courseKey={id as string} weekNum={selectedModule?.order || 1} />)}
                      className="p-4 rounded-2xl border border-slate-800 bg-slate-950/50 hover:bg-slate-900 hover:border-blue-500/30 transition-all duration-300 cursor-zoom-in flex justify-center items-center group shadow-xl"
                    >
                      <div className="transform group-hover:scale-105 transition duration-500 w-full max-w-[280px]">
                        <ModuleBlueprintSVG courseKey={id as string} weekNum={selectedModule?.order || 1} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Control */}
                <div className="flex justify-between items-center pt-8 border-t border-slate-800/80 mt-12">
                  {!readModules.includes(activeModuleIndex) && !isCourseCompleted ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleMarkModuleRead}
                      className="ml-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/50 flex items-center gap-3"
                    >
                      Mark as Read & Continue <ChevronRight size={18} />
                    </motion.button>
                  ) : (
                    <div className="w-full flex justify-between items-center">
                       <span className="text-emerald-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                          <CheckCircle2 size={16} /> Module Completed
                       </span>
                       {activeModuleIndex < modules.length - 1 && (
                         <button
                           onClick={() => setActiveModuleIndex(activeModuleIndex + 1)}
                           className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition flex items-center gap-2"
                         >
                           Next Module <ChevronRight size={14} />
                         </button>
                       )}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Certification Paywall */}
      {isCourseCompleted && !checkingPayment && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-10 rounded-3xl relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-yellow-500/20 shadow-2xl shadow-yellow-900/10"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {!isPaid ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              
              <div className="relative group/cert select-none perspective-1000">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-50 group-hover/cert:opacity-80 transition duration-700"></div>
                
                <motion.div 
                  whileHover={{ rotateY: 5, rotateX: 5 }}
                  className="relative border-2 border-yellow-500/30 p-6 rounded-2xl bg-slate-950 aspect-[1.41/1] overflow-hidden flex flex-col justify-between items-center text-center filter blur-[2px] contrast-75 brightness-75 select-none pointer-events-none shadow-2xl"
                >
                  <div className="text-[9px] tracking-widest text-slate-500 font-black uppercase">Nexus Academic Registry</div>
                  <div className="my-auto space-y-2 w-full px-8">
                    <h3 className="text-yellow-500/80 font-serif font-black text-lg uppercase tracking-widest border-b border-yellow-500/20 pb-2">Certificate of Accomplishment</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2">Awarded to</p>
                    <p className="text-2xl font-black text-white tracking-tight">{user?.name || "STUDENT NAME"}</p>
                    <p className="text-[9px] text-slate-400 max-w-[280px] leading-relaxed mx-auto font-medium">for demonstrating outstanding expertise and passing the rigorous final examination in deep technical domains.</p>
                  </div>
                  <div className="w-full flex justify-between items-center text-[8px] text-slate-500 px-4 font-mono font-bold">
                    <div>VERIFIED ID: HIDDEN</div>
                    <div>GRADE: {bestGrade}</div>
                  </div>
                </motion.div>

                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                  <div className="px-6 py-3 bg-slate-950/80 backdrop-blur text-yellow-500 border border-yellow-500/50 rounded-2xl text-xs font-black tracking-widest uppercase rotate-[-8deg] shadow-2xl flex items-center gap-2">
                    <Lock size={16} /> Locked
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-left relative z-10">
                <div className="inline-block bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-2">
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
                    <div key={idx} className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <Check size={16} className="text-yellow-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleInitiatePayment}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-yellow-600/20 text-xs uppercase tracking-widest"
                  >
                    Unlock Certificate (₹499)
                  </motion.button>
                  <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-black tracking-widest bg-slate-900/50 px-4 py-2 rounded-xl">
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
                onClick={() => navigate(`/certificate?courseId=\${id}`)}
                className="mt-4 px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-900/30 text-sm uppercase tracking-widest"
              >
                View High-Res Certificate
              </motion.button>
            </div>
          )}
        </motion.div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-950 border border-slate-800 p-10 rounded-3xl w-full max-w-3xl aspect-[1.5/1] relative shadow-2xl flex flex-col justify-center items-center"
            >
              <button 
                onClick={() => setLightboxImage(null)}
                className="absolute right-6 top-6 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl transition-all"
              >
                Close ✕
              </button>
              
              <div className="w-full h-full flex items-center justify-center">
                {lightboxImage}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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