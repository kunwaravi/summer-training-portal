import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Award, ArrowLeft, Printer, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

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
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        
        .font-serif-nexus {
          font-family: 'Cinzel', Georgia, serif;
        }
        .font-sans-nexus {
          font-family: 'Montserrat', sans-serif;
        }

        .cert-mesh-grid-premium {
          background-color: #060a16;
          background-image: 
            linear-gradient(to right, rgba(245, 158, 11, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(245, 158, 11, 0.015) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, #0d1a36 0%, #050812 100%);
          background-size: 28px 28px, 100% 100%;
        }

        .gold-glow-border {
          filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.25));
        }

        /* Landscape A4 Print Optimization */
        @media print {
          body, html {
            background: #050a15 !important;
            color: white !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
          }
          nav, button, .no-print {
            display: none !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: #050a15 !important;
          }
          .nexus-cert-frame {
            box-shadow: none !important;
            transform: scale(1.0) !important;
            border-width: 16px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: landscape;
            margin: 0;
          }
        }
      `}</style>

      {/* Action Navigation Row */}
      <div className="w-full flex justify-between items-center no-print">
        <button 
          onClick={() => navigate(`/course/${courseId}`)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-bold uppercase tracking-wider"
        >
          ← Return to Study Console
        </button>
        <span className="text-xs uppercase text-amber-500 font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 shadow">
          <ShieldCheck size={14} /> Official Corporate Accreditation
        </span>
      </div>

      {/* Ultra-Premium & Highly Attractive Certificate Frame */}
      <motion.div 
        ref={certRef}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="nexus-cert-frame cert-mesh-grid-premium text-white p-12 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] w-full max-w-[850px] aspect-[1.414] relative border-[15px] border-slate-950 select-none overflow-hidden"
      >
        {/* Subtle glowing amber ambient spots */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Glowing Gold Corner Framings & Connecting Border Lines */}
        <div className="absolute top-6 left-6 w-12 h-12 border-t-[5px] border-l-[5px] border-amber-500 rounded-tl-[4px] gold-glow-border"></div>
        <div className="absolute top-6 right-6 w-12 h-12 border-t-[5px] border-r-[5px] border-amber-500 rounded-tr-[4px] gold-glow-border"></div>
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b-[5px] border-l-[5px] border-amber-500 rounded-bl-[4px] gold-glow-border"></div>
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-[5px] border-r-[5px] border-amber-500 rounded-br-[4px] gold-glow-border"></div>

        <div className="absolute top-6 left-16 right-16 h-[1.5px] bg-gradient-to-r from-amber-500/40 via-amber-500 to-amber-500/40 gold-glow-border"></div>
        <div className="absolute bottom-6 left-16 right-16 h-[1.5px] bg-gradient-to-r from-amber-500/40 via-amber-500 to-amber-500/40 gold-glow-border"></div>
        <div className="absolute left-6 top-16 bottom-16 w-[1.5px] bg-gradient-to-b from-amber-500/40 via-amber-500 to-amber-500/40 gold-glow-border"></div>
        <div className="absolute right-6 top-16 bottom-16 w-[1.5px] bg-gradient-to-b from-amber-500/40 via-amber-500 to-amber-500/40 gold-glow-border"></div>

        {/* Certificate Text & Graphical Layout */}
        <div className="flex flex-col items-center justify-between h-full relative z-10 text-center font-sans-nexus">
          
          {/* Header block with elegant Cinzel font */}
          <div className="space-y-1">
            <h1 className="text-amber-500 text-2xl sm:text-3xl font-serif-nexus font-black uppercase tracking-[0.12em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              NEXUS EMBEDDED SYSTEMS & IoT SOLUTIONS
            </h1>
            <p className="text-indigo-400 font-extrabold uppercase text-[9px] sm:text-[11px] tracking-[0.25em] drop-shadow">
              INDUSTRIAL TRAINING & CORE ELECTRONICS INNOVATION PORTAL
            </p>
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2.5"></div>
          </div>

          {/* Specialization copy */}
          <div className="space-y-1.5 mt-2">
            <h4 className="text-slate-400 font-extrabold uppercase text-[9px] sm:text-[10px] tracking-[0.3em]">
              SUMMER TRAINING COMPLETION CREDENTIALS
            </h4>
            <p className="text-slate-500 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-semibold">
              THIS IS PROUDLY CONFERRED UPON THE DEVELOPER
            </p>
          </div>

          {/* Student name styled in massive gold type */}
          <div className="py-1">
            <h2 className="text-amber-500 text-4xl sm:text-5xl font-serif-nexus font-black tracking-wide uppercase drop-shadow-[0_3px_5px_rgba(0,0,0,0.6)]">
              {data.name}
            </h2>
          </div>

          {/* Institutional description */}
          <div className="space-y-2 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            <p className="font-semibold text-slate-200">
              Son / Daughter of Sh. <span className="uppercase text-white font-bold">{data.fatherName}</span>
            </p>
            <p className="text-slate-400 text-xs">
              representing institution: <span className="text-slate-200 font-semibold uppercase tracking-wide">{data.collegeName}</span>
            </p>
            <p className="text-slate-400 text-xs">
              pursuing branch: <span className="text-slate-200 font-semibold">{data.branchName} Engineering</span>
            </p>
            <p className="text-slate-400 text-xs pt-0.5">
              for successfully executing specialized summer training curriculum in
            </p>
            
            {/* accredited specialization */}
            <h3 className="text-amber-500 text-lg sm:text-xl font-black tracking-wider uppercase drop-shadow">
              {data.courseName}
            </h3>
            
            <p className="text-slate-450 text-[10px] sm:text-[11px] italic font-semibold mt-1">
              Training Duration: From June 1, 2026 To June 28, 2026
            </p>
          </div>

          {/* Performance Review Translucent Glass Box */}
          <div className="mt-2.5 border border-indigo-500/30 bg-indigo-500/5 px-6 py-2.5 rounded-xl text-cyan-400 font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-[inset_0_1px_8px_rgba(56,189,248,0.05)]">
            PERFORMANCE REVIEW: OUTSTANDING (GRADE {data.grade})
          </div>

          {/* Signatures & Seal Row */}
          <div className="w-full flex justify-between items-end px-4 sm:px-8 mt-5 shrink-0">
            
            {/* Technical Director Signature - Left (Gaurav's Real Vector Signature) */}
            <div className="text-center w-36 sm:w-44 space-y-1.5">
              <div className="h-10 flex items-center justify-center">
                {/* Traced vector version of Gaurav's real signature */}
                <svg width="120" height="42" viewBox="0 0 120 75" className="text-cyan-400 select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(56,189,248,0.25)]">
                  {/* Long vertical loop */}
                  <path d="M48,12 C48,4 45,4 45,12 L43,62 C43,69 40,75 39,75" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  {/* Oval loop on the left */}
                  <path d="M43,42 C28,32 25,56 43,51" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                  {/* Large sweep loop to the top right and back */}
                  <path d="M43,51 C43,36 55,16 78,11 C90,8 95,16 85,28 C75,40 58,46 48,52" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                  {/* Cursive text 'Gaurav' body inside loop */}
                  <path d="M50,38 Q60,31 68,44 T78,38 T82,42" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Cursive text 'Singh' body below */}
                  <path d="M56,54 C52,61 56,68 58,68 Q62,68 65,61 Q68,56 70,64 T78,61 Q82,60 88,60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="h-[1px] bg-slate-800 w-full"></div>
              <p className="text-xs font-bold text-white leading-tight">
                {data.signatures.technicalDirector}
              </p>
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
                Technical Director, Nexus Automation
              </p>
            </div>
            
            {/* Red stamp seal - Center */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-14 h-14 rounded-full flex items-center justify-center relative select-none">
                <svg width="56" height="56" viewBox="0 0 64 64" className="text-red-500/90 filter drop-shadow-[0_0_5px_rgba(239,68,68,0.35)]">
                  {/* Dashed circular frame */}
                  <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                  {/* Centered star */}
                  <path d="M32 20l2.5 5.5 6 .5-4.5 4 1.5 6-5.5-3.5-5.5 3.5 1.5-6-4.5-4 6-.5z" fill="currentColor" />
                  {/* Circular Text */}
                  <path id="nexus-seal-path" d="M 32,32 m -24,0 a 24,24 0 1,1 48,0 a 24,24 0 1,1 -48,0" fill="none" />
                  <text fill="currentColor" fontSize="4.2" fontWeight="bold" letterSpacing="0.9">
                    <textPath href="#nexus-seal-path" startOffset="0%">
                      * NEXUS EMBEDDED SYSTEMS LABS * OFFICIAL CERTIFIED SEAL
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>

            {/* CAO Signature - Right */}
            <div className="text-center w-36 sm:w-44 space-y-1.5">
              <div className="h-10 flex items-center justify-center">
                <svg width="110" height="28" viewBox="0 0 110 28" className="text-purple-450/85 select-none pointer-events-none">
                  <path d="M12,14 C22,25 35,6 48,15 C60,24 72,4 82,12 C92,20 98,22 104,10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="h-[1px] bg-slate-800 w-full"></div>
              <p className="text-xs font-bold text-white leading-tight">
                {data.signatures.chiefAcademicOfficer}
              </p>
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
                Chief Academic Officer, Nexus Labs
              </p>
            </div>
          </div>
          
          {/* Footer Credentials Registry Block */}
          <div className="w-full flex flex-col items-center space-y-1 mt-4 shrink-0 text-center">
            <p className="text-indigo-400 font-mono text-[9px] font-bold tracking-[0.15em]">
              Credential ID: {data.credentialId}
            </p>
            <p className="text-[7px] text-slate-500 uppercase tracking-widest font-semibold">
              Verify credentials authenticity online at: {window.location.origin}/verify?id={data.credentialId}
            </p>
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
