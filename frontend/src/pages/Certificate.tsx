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

  // Extract courseId from URL query parameter: e.g. /certificate?courseId=C
  const query = new URLSearchParams(window.location.search);
  const courseId = query.get('courseId') || 'C';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/certificate/${user.id}/${courseId}`);
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
      
      {/* High-fidelity CSS themes, grid mesh patterns, and landscape print overrides */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Montserrat:wght@300;400;600;800&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
        
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-garamond { font-family: 'EB Garamond', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }

        .cert-premium-bg {
          background-color: #fdfcf7; /* Ivory Parchment */
          background-image: 
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, transparent 100%),
            url("https://www.transparenttextures.com/patterns/pinstriped-suit.png");
          color: #1a2a44;
        }

        .luxury-border-outer {
          border: 2px solid #b8860b;
          padding: 8px;
          position: relative;
        }

        .luxury-border-inner {
          border: 8px double #b8860b;
          padding: 40px;
          height: 100%;
          position: relative;
        }

        .gold-gradient-text {
          background: linear-gradient(to bottom, #b8860b 0%, #8b6508 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .embossed-seal {
          filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.15));
          transition: all 0.3s ease;
        }

        /* Landscape A4 Print Optimization */
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body, html {
            background: white !important;
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
            background: white !important;
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
            background-color: #fdfcf7 !important;
            border: 20px solid #1a2a44 !important;
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
      </div>

      {/* Ultra-Premium Institutional Certificate Frame */}
      <motion.div 
        ref={certRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="nexus-cert-frame cert-premium-bg rounded-sm shadow-2xl w-full max-w-[950px] aspect-[1.414] relative border-[20px] border-[#1a2a44] p-4 select-none overflow-hidden"
      >
        <div className="luxury-border-outer h-full w-full">
          <div className="luxury-border-inner h-full w-full flex flex-col items-center justify-between text-center relative">
            
            {/* Elegant Corner Motifs */}
            <div className="absolute top-[-15px] left-[-15px] w-24 h-24 pointer-events-none opacity-80">
              <svg viewBox="0 0 100 100" fill="none" stroke="#b8860b" strokeWidth="1.5">
                <path d="M0,50 Q0,0 50,0 M10,50 Q10,10 50,10 M20,50 Q20,20 50,20" />
              </svg>
            </div>
            <div className="absolute top-[-15px] right-[-15px] w-24 h-24 rotate-90 pointer-events-none opacity-80">
              <svg viewBox="0 0 100 100" fill="none" stroke="#b8860b" strokeWidth="1.5">
                <path d="M0,50 Q0,0 50,0 M10,50 Q10,10 50,10 M20,50 Q20,20 50,20" />
              </svg>
            </div>
            <div className="absolute bottom-[-15px] left-[-15px] w-24 h-24 -rotate-90 pointer-events-none opacity-80">
              <svg viewBox="0 0 100 100" fill="none" stroke="#b8860b" strokeWidth="1.5">
                <path d="M0,50 Q0,0 50,0 M10,50 Q10,10 50,10 M20,50 Q20,20 50,20" />
              </svg>
            </div>
            <div className="absolute bottom-[-15px] right-[-15px] w-24 h-24 rotate-180 pointer-events-none opacity-80">
              <svg viewBox="0 0 100 100" fill="none" stroke="#b8860b" strokeWidth="1.5">
                <path d="M0,50 Q0,0 50,0 M10,50 Q10,10 50,10 M20,50 Q20,20 50,20" />
              </svg>
            </div>

            {/* Header: Institutional Branding */}
            <div className="space-y-3 pt-4">
              <h1 className="text-[#1a2a44] text-3xl sm:text-4xl font-cinzel font-black uppercase tracking-[0.15em]">
                Nexus Institute of Technology
              </h1>
              <div className="flex items-center justify-center gap-4">
                <div className="h-[1px] w-20 bg-[#b8860b]"></div>
                <p className="text-[#b8860b] font-montserrat font-extrabold uppercase text-[10px] tracking-[0.4em]">
                  Accredited by Nexus Embedded Systems Labs
                </p>
                <div className="h-[1px] w-20 bg-[#b8860b]"></div>
              </div>
            </div>

            {/* Title Section */}
            <div className="space-y-4">
              <h2 className="text-[#1a2a44] text-4xl sm:text-5xl font-garamond italic font-semibold">
                Certificate of Achievement
              </h2>
              <p className="font-montserrat text-[11px] text-[#555] uppercase tracking-[0.2em] font-medium">
                This credential is formally awarded to
              </p>
            </div>

            {/* Name Section: The Main Focus */}
            <div className="py-2 border-b border-[#b8860b]/30 w-[80%]">
              <h3 className="text-[#1a2a44] text-5xl sm:text-6xl font-playfair font-black tracking-tight uppercase">
                {data.name}
              </h3>
            </div>

            {/* Accomplishment Details */}
            <div className="space-y-3 font-garamond text-lg sm:text-xl text-[#333]">
              <p>
                Son / Daughter of <span className="font-bold text-[#1a2a44]">{data.fatherName}</span>
              </p>
              <p className="text-sm font-montserrat text-[#666] uppercase tracking-wider">
                For successful completion of advanced industrial training in
              </p>
              <h4 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#1a2a44] gold-gradient-text">
                {data.courseName}
              </h4>
              <p className="text-sm italic text-[#777]">
                Conducted from June 1, 2026 to June 28, 2026
              </p>
            </div>

            {/* Grade Badge */}
            <div className="bg-[#1a2a44] text-[#fdfcf7] px-8 py-2 rounded-full font-montserrat font-bold text-xs uppercase tracking-[0.2em]">
              Performance Grade: {data.grade}
            </div>

            {/* Signatures & Seal Row */}
            <div className="w-full flex justify-between items-end px-12 mt-4">
              
              <div className="signature-box flex flex-col items-center space-y-2">
                <div className="h-12 flex items-end">
                   <svg width="120" height="40" viewBox="0 0 120 40" className="text-[#1a2a44] opacity-90">
                    <path d="M10,30 Q30,10 50,25 T90,15 T110,30" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  </svg>
                </div>
                <div className="h-[1px] w-full bg-[#1a2a44]/30"></div>
                <p className="text-[10px] font-cinzel font-bold text-[#1a2a44]">{data.signatures.technicalDirector}</p>
                <p className="text-[8px] font-montserrat font-bold uppercase text-[#888]">Director of Technology</p>
              </div>

              {/* Embossed Luxury Seal */}
              <div className="relative embossed-seal">
                <svg width="80" height="80" viewBox="0 0 100 100" className="text-[#b8860b]">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                  <path d="M50 20 L58 38 L78 38 L62 50 L68 70 L50 58 L32 70 L38 50 L22 38 L42 38 Z" fill="currentColor" opacity="0.9" />
                  <path id="sealText" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                  <text fill="currentColor" fontSize="5.5" fontWeight="900" letterSpacing="1">
                    <textPath href="#sealText" startOffset="0%">
                      • NEXUS INSTITUTE • OFFICIAL SEAL • EXCELLENCE •
                    </textPath>
                  </text>
                </svg>
              </div>

              <div className="signature-box flex flex-col items-center space-y-2">
                <div className="h-12 flex items-end">
                  <svg width="120" height="40" viewBox="0 0 120 40" className="text-[#1a2a44] opacity-90">
                    <path d="M15,25 C30,10 45,35 60,15 S90,25 105,10" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  </svg>
                </div>
                <div className="h-[1px] w-full bg-[#1a2a44]/30"></div>
                <p className="text-[10px] font-cinzel font-bold text-[#1a2a44]">{data.signatures.chiefAcademicOfficer}</p>
                <p className="text-[8px] font-montserrat font-bold uppercase text-[#888]">Academic Officer</p>
              </div>

            </div>

            {/* ID & Verification Block */}
            <div className="w-full flex justify-between items-center px-4 pt-4 border-t border-[#b8860b]/20 mt-2">
              <p className="text-[8px] font-montserrat font-bold text-[#888] uppercase tracking-widest">
                Credential ID: {data.credentialId}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[7px] font-montserrat font-bold text-[#aaa] uppercase italic">Scan to Verify Authenticity</span>
                <div className="bg-white p-0.5 border border-[#b8860b]/30">
                  <QRCodeSVG 
                    value={`${window.location.origin}/verify?id=${data.credentialId}`} 
                    size={32}
                    level="H"
                  />
                </div>
              </div>
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
