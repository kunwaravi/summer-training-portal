import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Award, Printer, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const Certificate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const certRef = useRef<HTMLDivElement>(null);

  const getFormattedDate = () => {
    if (!data || !data.completionDate) return '30-05-2026';
    try {
      const d = new Date(data.completionDate);
      if (isNaN(d.getTime())) return data.completionDate;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) {
      return data.completionDate;
    }
  };

  // Extract courseId from URL query parameter: e.g. /certificate?courseId=C
  const query = new URLSearchParams(window.location.search);
  const courseId = query.get('courseId') || 'C';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/certificate/${courseId}`);
        setData(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch certificate. Make sure you completed all 4 weeks.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchData();
    }
  }, [user?.id, courseId]);

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Verifying qualifications and rendering certified NEXUS credentials...</div>;
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <Award className="text-red-500 mx-auto" size={48} />
        <h2 className="text-xl font-bold">Access Blocked</h2>
        <p className="text-slate-400 text-sm">{error || 'Certificate not generated yet.'}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-sm transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 flex flex-col items-center max-w-5xl mx-auto px-4 space-y-6 print-container animate-fade-in">
      
      {/* High-fidelity CSS themes, glowing gradients, and dark-theme landscape print overrides */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Montserrat:wght@300;400;600;700;800;900&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
        
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-garamond { font-family: 'EB Garamond', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }

        .cert-dark-bg {
          background-color: #060709;
          background-image: 
            radial-gradient(circle at 50% 25%, rgba(0, 229, 255, 0.09) 0%, transparent 55%),
            radial-gradient(circle at 80% 80%, rgba(0, 229, 255, 0.04) 0%, transparent 40%),
            url("https://www.transparenttextures.com/patterns/dark-matter.png");
          color: #ffffff;
        }

        .luxury-double-border {
          border: 4px double rgba(255, 255, 255, 0.85);
          position: absolute;
          inset: 12px;
          border-radius: 8px;
          pointer-events: none;
        }

        .luxury-inner-line {
          border: 1px solid rgba(255, 255, 255, 0.15);
          position: absolute;
          inset: 22px;
          border-radius: 6px;
          pointer-events: none;
        }

        .neon-cyan-glow {
          color: #00e5ff;
          text-shadow: 0 0 12px rgba(0, 229, 255, 0.6);
        }

        .neon-cyan-text-shadow {
          text-shadow: 0 0 10px rgba(0, 229, 255, 0.35);
        }

        /* Landscape A4 Print Optimization for Dark Theme */
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body, html {
            background: #060709 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            height: 100%;
            overflow: hidden;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          nav, button, .no-print {
            display: none !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: #060709 !important;
            overflow: hidden !important;
          }
          .nexus-cert-frame {
            box-shadow: none !important;
            transform: scale(0.96) !important;
            transform-origin: center center !important;
            margin: auto !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1.414 / 1 !important;
            background-color: #060709 !important;
            background-image: 
              radial-gradient(circle at 50% 25%, rgba(0, 229, 255, 0.09) 0%, transparent 55%),
              radial-gradient(circle at 80% 80%, rgba(0, 229, 255, 0.04) 0%, transparent 40%),
              url("https://www.transparenttextures.com/patterns/dark-matter.png") !important;
            border: 20px solid #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          h1, h2, h3, h4, p {
            white-space: nowrap !important;
          }
          .signature-box {
            width: 25% !important;
          }
        }
      `}</style>

      {/* Action Navigation Row */}
      <div className="w-full flex justify-between items-center no-print">
        <button 
          onClick={() => navigate(`/course/${courseId}`)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-bold uppercase tracking-wider"
        >
          ← Return to Console
        </button>
        <span className="text-xs uppercase text-amber-600 font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 shadow">
          <ShieldCheck size={14} /> Academic Excellence Verification
        </span>
      </div>      {/* Ultra-Premium Institutional Certificate Frame (Edunexus Dark Theme) */}
      <motion.div 
        ref={certRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="nexus-cert-frame cert-dark-bg rounded-2xl shadow-2xl w-full max-w-[950px] aspect-[1.414] relative border-[12px] border-[#000000] p-8 select-none overflow-hidden"
      >
        {/* Double-Line Premium Borders */}
        <div className="luxury-double-border"></div>
        <div className="luxury-inner-line"></div>

        {/* Elegant Translucent Watermark in Center Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-[50%] h-[50%] text-[#00e5ff] fill-current">
            <path d="M20 20 H80 V32 H35 V44 H70 V56 H35 V68 H80 V80 H20 Z" />
          </svg>
        </div>

        {/* Outer/Inner main flex wrapper */}
        <div className="h-full w-full flex flex-col justify-between items-center relative z-10 p-4">
          
          {/* Top Row: SkillsMint Logo (Left) and Gold Trophy (Center) */}
          <div className="w-full flex items-center justify-between">
            {/* Logo Left */}
            <div className="flex items-center gap-2 select-none">
              <svg viewBox="0 0 100 100" className="w-9 h-9 text-[#00e5ff] fill-current filter drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                <path d="M20 20 H80 V32 H35 V44 H70 V56 H35 V68 H80 V80 H20 Z" />
              </svg>
              <div className="flex items-baseline font-montserrat">
                <span className="text-[25px] font-black text-[#00e5ff] tracking-tight drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">Edu</span>
                <span className="text-[25px] font-bold text-white tracking-tight">nexus</span>
              </div>
            </div>

            {/* Empty center spacing to balance the trophy */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-1">
              {/* Ultra-High-Fidelity Gold Trophy SVG */}
              <svg viewBox="0 0 100 100" className="w-20 h-20 filter drop-shadow-[0_4px_12px_rgba(255,215,0,0.35)]">
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE259" />
                    <stop offset="50%" stopColor="#FFC837" />
                    <stop offset="100%" stopColor="#aa771c" />
                  </linearGradient>
                  <linearGradient id="shineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7"/>
                    <stop offset="100%" stopColor="#FFC837" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Laurel Leaves around Trophy */}
                <g stroke="url(#goldGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round">
                  <path d="M 30,58 C 21,52 17,40 19,29 C 21,18 30,12 39,15" />
                  <path d="M 70,58 C 79,52 83,40 81,29 C 79,18 70,12 61,15" />
                  {/* Leaves Left */}
                  <path d="M 28,55 Q 18,53 25,47 Z" fill="url(#goldGrad)" />
                  <path d="M 22,43 Q 13,39 20,33 Z" fill="url(#goldGrad)" />
                  <path d="M 19,30 Q 11,24 19,19 Z" fill="url(#goldGrad)" />
                  <path d="M 23,18 Q 18,9 27,9 Z" fill="url(#goldGrad)" />
                  <path d="M 32,13 Q 32,3 38,7 Z" fill="url(#goldGrad)" />
                  {/* Leaves Right */}
                  <path d="M 72,55 Q 82,53 75,47 Z" fill="url(#goldGrad)" />
                  <path d="M 78,43 Q 87,39 80,33 Z" fill="url(#goldGrad)" />
                  <path d="M 81,30 Q 89,24 81,19 Z" fill="url(#goldGrad)" />
                  <path d="M 77,18 Q 82,9 73,9 Z" fill="url(#goldGrad)" />
                  <path d="M 68,13 Q 68,3 62,7 Z" fill="url(#goldGrad)" />
                </g>
                {/* Trophy Structure */}
                <path d="M 38,72 L 62,72 L 58,66 L 42,66 Z" fill="url(#goldGrad)" />
                <rect x="46" y="58" width="8" height="8" fill="url(#goldGrad)" />
                <path d="M 40,58 Q 50,61 60,58 L 57,54 L 43,54 Z" fill="url(#goldGrad)" />
                <path d="M 36,25 C 36,47 40,54 50,54 C 60,54 64,47 64,25 Z" fill="url(#goldGrad)" />
                <ellipse cx="50" cy="25" rx="14" ry="2" fill="url(#goldGrad)" />
                {/* Handles */}
                <path d="M 36,28 C 26,28 26,42 36,44" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
                <path d="M 64,28 C 74,28 74,42 64,44" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
                {/* Highlight */}
                <path d="M 40,28 C 40,44 43,50 50,51 C 45,47 42,39 42,28 Z" fill="url(#shineGrad)" />
              </svg>
            </div>
            
            {/* Symmetrical placeholder for spacing */}
            <div className="w-[120px] no-print"></div>
          </div>

          {/* Certificate Main Body Texts */}
          <div className="text-center space-y-4 my-2">
            <h2 className="text-[#00e5ff] text-4xl sm:text-5xl font-montserrat font-extrabold tracking-[0.06em] uppercase neon-cyan-glow">
              Certificate of Completion
            </h2>
            <p className="text-slate-100 font-garamond italic text-lg sm:text-[22px] tracking-wide">
              This certificate is proudly presented to
            </p>
            <h3 className="text-[#00e5ff] text-5xl sm:text-6xl font-montserrat font-black tracking-wide uppercase neon-cyan-text-shadow pt-2">
              {data.name}
            </h3>
            <p className="text-slate-200 font-montserrat text-xs uppercase tracking-[0.25em] pt-1">
              For Successfully Completing the Assessment of
            </p>
            <h4 className="text-white text-3xl sm:text-4xl font-montserrat font-black tracking-[0.05em] uppercase drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]">
              {data.courseName}
            </h4>
          </div>

          {/* Bottom Footer Section: Columns for QR/ID (Left), MD Signature (Center), MSME Stamp (Right) */}
          <div className="w-full grid grid-cols-3 items-end px-4 mt-2">
            
            {/* Column 1: QR & Authenticity (Left) */}
            <div className="flex flex-col items-start text-left space-y-2">
              <div className="flex flex-col space-y-1.5">
                <span className="text-[10px] font-montserrat font-semibold text-slate-400 uppercase tracking-wider">
                  Authenticate your certificate here
                </span>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-1 rounded border border-cyan-500/30 shadow-[0_0_10px_rgba(0,229,255,0.15)] flex items-center justify-center">
                    <QRCodeSVG 
                      value={`${window.location.origin}/verify?id=${data.credentialId}`} 
                      size={54}
                      level="H"
                    />
                  </div>
                  <div className="flex flex-col justify-end text-[10px] font-montserrat text-slate-300 font-medium space-y-0.5">
                    <div>DATE : {getFormattedDate()}</div>
                    <div className="uppercase">CERTIFICATE NO : {data.credentialId}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Signature (Center) */}
            <div className="flex flex-col items-center justify-end text-center space-y-1.5 pb-0.5">
              {/* Realistic Handwritten Signature SVG */}
              <div className="h-12 flex items-end justify-center">
                <svg width="120" height="42" viewBox="0 0 120 40" className="text-white opacity-95 filter drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)]">
                  <path 
                    d="M 15,28 C 25,22 35,10 40,8 C 45,6 50,15 48,22 C 45,30 38,36 34,36 C 30,36 28,30 32,24 C 38,15 48,12 55,18 C 62,24 65,30 72,28 C 80,26 82,16 85,12 C 88,8 92,20 90,24 C 88,28 92,30 96,28 C 102,25 106,18 110,14" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>
              
              <div className="w-[160px] h-[1px] bg-slate-400/50"></div>
              
              <div className="space-y-0.5">
                <p className="text-[11px] font-montserrat font-bold text-white tracking-wider uppercase">
                  Gaurav Sinha
                </p>
                <p className="text-[9px] font-montserrat font-bold text-[#00e5ff] tracking-wide uppercase">
                  Managing Director & CEO
                </p>
              </div>
            </div>

            {/* Column 3: MSME Seal Emblem (Right) */}
            <div className="flex flex-col items-end justify-end">
              {/* Premium Gold Circular MSME Badge Vector SVG */}
              <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-[0_0_8px_rgba(255,215,0,0.25)]">
                <defs>
                  <linearGradient id="msmeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE259" />
                    <stop offset="60%" stopColor="#FFC837" />
                    <stop offset="100%" stopColor="#c59b27" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="46" fill="#060709" stroke="url(#msmeGoldGrad)" strokeWidth="1.8" />
                <circle cx="50" cy="50" r="41" fill="none" stroke="url(#msmeGoldGrad)" strokeWidth="0.8" strokeDasharray="3 1.5" />
                
                {/* Center State Emblem (Lion Capital of Ashoka representation in Gold) */}
                <g transform="translate(36, 26) scale(0.28)" fill="url(#msmeGoldGrad)">
                  <path d="M20,30 C20,15 28,10 32,20 C34,25 30,35 30,45 L25,45 C23,45 20,40 20,30 Z" />
                  <path d="M35,25 C35,10 65,10 65,25 C65,40 58,55 58,70 L42,70 C42,55 35,40 35,25 Z" />
                  <circle cx="50" cy="22" r="3.2" fill="#060709" />
                  <path d="M44,35 Q50,42 56,35 L54,32 L46,32 Z" fill="#060709" />
                  <path d="M46,45 L54,45 L50,55 Z" />
                  <path d="M80,30 C80,15 72,10 68,20 C66,25 70,35 70,45 L75,45 C77,45 80,40 80,30 Z" />
                  <rect x="25" y="70" width="50" height="7" rx="1.5" />
                  <circle cx="50" cy="73.5" r="3" fill="#060709" stroke="url(#msmeGoldGrad)" strokeWidth="1" />
                  <path d="M 15 84 L 85 84 L 75 92 L 25 92 Z" />
                </g>
                
                {/* Curved Border Texts */}
                <path id="msmeTextCurve" d="M 50,50 m -34.5,0 a 34.5,34.5 0 1,1 69,0 a 34.5,34.5 0 1,1 -69,0" fill="none" />
                <text fill="url(#msmeGoldGrad)" fontSize="5.5" fontWeight="800" letterSpacing="0.6">
                  <textPath href="#msmeTextCurve" startOffset="5%" textAnchor="middle">
                    MINISTRY OF MSME • GOVT OF INDIA
                  </textPath>
                </text>
                
                <path id="msmeInnerCurve" d="M 50,50 m -33.5,0 a 33.5,33.5 0 1,0 67,0 a 33.5,33.5 0 1,0 -67,0" fill="none" />
                <text fill="url(#msmeGoldGrad)" fontSize="8.5" fontWeight="900" letterSpacing="0.8">
                  <textPath href="#msmeInnerCurve" startOffset="50%" textAnchor="middle">
                    MSME
                  </textPath>
                </text>
              </svg>
            </div>

          </div>

        </div>
      </motion.div>

      {/* Action Printing controls */}
      <div className="w-full flex justify-center gap-4 no-print pt-2">
        <button 
          onClick={() => window.print()}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition text-sm active:scale-95 shadow-amber-500/10"
        >
          <Printer size={18} /> Print / Export PDF Certificate
        </button>
      </div>
    </div>
  );
};

export default Certificate;
