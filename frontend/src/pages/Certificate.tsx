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

  // Extract courseId and optional userId from URL query parameters: e.g. /certificate?courseId=C&userId=123
  const query = new URLSearchParams(window.location.search);
  const courseId = query.get('courseId') || 'C';
  const targetUserId = query.get('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = targetUserId 
          ? `/certificate/${targetUserId}/${courseId}`
          : `/certificate/${courseId}`;
        const res = await api.get(endpoint);
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
  }, [user?.id, courseId, targetUserId]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 bg-slate-950 min-h-screen text-slate-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
        <p className="text-sm font-semibold uppercase tracking-widest">Verifying qualifications and rendering certified credentials...</p>
      </div>
    );
  }

  if ((error || !data) && user?.role !== 'ADMIN') {
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

  // Handle fallback data for admin preview if actual data is missing
  const displayData = data || {
    name: user?.name || "AVINASH KUNWAR",
    fatherName: user?.fatherName || "AKHILESH KUNWAR",
    collegeName: user?.collegeName || "GOVERNMENT POLYTECHNIC GHAZIABAD",
    branchName: user?.branchName || "Electronics Engineering",
    courseName: "C++ & OOP for Embedded Systems",
    credentialId: "ENL-2026-EDM5926",
    startDate: "June 1, 2026",
    endDate: "June 28, 2026",
    grade: "Outstanding"
  };

  const getPerformanceReviewText = (grade: string) => {
    const upperGrade = (grade || '').toUpperCase();
    if (upperGrade === 'OUTSTANDING') return 'OUTSTANDING (GRADE A)';
    if (upperGrade === 'EXCELLENT') return 'EXCELLENT (GRADE B)';
    if (upperGrade === 'VERY GOOD') return 'VERY GOOD (GRADE C)';
    if (upperGrade === 'GOOD') return 'GOOD (GRADE D)';
    return `${upperGrade} (GRADE A)`;
  };

  return (
    <div className="py-6 flex flex-col items-center max-w-5xl mx-auto px-4 space-y-6 print-container animate-fade-in">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@400;600;700&display=swap');
        
        .cert-body-style {
          font-family: 'Montserrat', sans-serif;
        }

        /* Certificate Container adapted for web + print scaling */
        .certificate-container {
            width: 100%;
            max-width: 950px;
            aspect-ratio: 297 / 210;
            background: radial-gradient(circle, #0a1128 0%, #020617 100%);
            color: #ffffff;
            padding: 55px 65px;
            box-sizing: border-box;
            position: relative;
            border: 8px solid #b392ac; 
            overflow: hidden;
            box-shadow: 0 0 50px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* Tech/Circuit Style Inner Border Design */
        .certificate-container::before {
            content: '';
            position: absolute;
            top: 15px; left: 15px; right: 15px; bottom: 15px;
            border: 2px solid #d4af37;
            pointer-events: none;
        }

        /* Decorative Corners */
        .corner {
            position: absolute;
            width: 40px;
            height: 40px;
            border: 4px solid #d4af37;
            pointer-events: none;
        }
        .top-left { top: 25px; left: 25px; border-right: none; border-bottom: none; }
        .top-right { top: 25px; right: 25px; border-left: none; border-bottom: none; }
        .bottom-left { bottom: 25px; left: 25px; border-right: none; border-top: none; }
        .bottom-right { bottom: 25px; right: 25px; border-left: none; border-top: none; }

        .content {
            text-align: center;
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .logo-area {
            font-family: 'Cinzel', serif;
            font-size: 34px;
            font-weight: 700;
            color: #d4af37;
            letter-spacing: 5px;
            margin-top: 5px;
            text-shadow: 0px 0px 10px rgba(212, 175, 55, 0.3);
        }

        .sub-logo {
            font-size: 11px;
            letter-spacing: 4px;
            color: #94a3b8;
            text-transform: uppercase;
            margin-top: 3px;
            margin-bottom: 15px;
        }

        .cert-title {
            font-family: 'Cinzel', serif;
            font-size: 22px;
            color: #ffffff;
            letter-spacing: 2px;
            margin-bottom: 3px;
        }

        .conferred-text {
            font-size: 11px;
            text-transform: uppercase;
            color: #94a3b8;
            letter-spacing: 3px;
            margin-bottom: 10px;
        }

        .student-name {
            font-family: 'Cinzel', serif;
            font-size: 40px;
            font-weight: 700;
            color: #d4af37;
            margin: 10px 0;
            letter-spacing: 2px;
            text-shadow: 0px 2px 4px rgba(0,0,0,0.5);
        }

        .details-text {
            font-size: 14px;
            line-height: 1.7;
            color: #e2e8f0;
            max-width: 800px;
            margin: 0 auto;
        }

        .highlight {
            color: #ffffff;
            font-weight: 600;
        }

        .course-box {
            display: inline-block;
            border: 2px solid #d4af37;
            background: rgba(212, 175, 55, 0.05);
            padding: 8px 30px;
            font-size: 18px;
            font-weight: 600;
            color: #d4af37;
            margin: 15px 0;
            border-radius: 4px;
            letter-spacing: 1px;
        }

        .duration-performance {
            font-size: 13px;
            color: #cbd5e1;
            margin-bottom: 25px;
        }

        .footer-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 20px;
            margin-top: 10px;
        }

        .credential-info {
            text-align: left;
            font-size: 11px;
            color: #64748b;
            line-height: 1.5;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .qr-code {
            width: 70px;
            height: 70px;
            background: white;
            padding: 5px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .signature-block {
            text-align: center;
            width: 220px;
        }

        .ceo-signature {
            width: 130px;
            height: 50px;
            object-fit: contain;
            margin-bottom: -5px;
            filter: brightness(0) invert(1);
        }

        .signature-line {
            border: none;
            border-top: 1px solid #64748b;
            margin-bottom: 8px;
            width: 100%;
        }

        .sig-title {
            font-size: 12px;
            font-weight: 600;
            color: #ffffff;
        }

        .sig-company {
            font-size: 10px;
            color: #94a3b8;
        }

        /* Golden Badge Logo */
        .cert-badge-logo {
            position: absolute;
            top: 35px;
            right: 45px;
            width: 75px;
            height: 75px;
            object-fit: contain;
            z-index: 10;
            filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.35));
        }

        /* Landscape A4 Print Optimization */
        @media print {
            @page {
                size: A4 landscape;
                margin: 0;
            }
            body, html, #root, .min-h-screen, .container, .mx-auto, .px-4, .py-8 {
                background: #020617 !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                max-width: none !important;
                min-width: 0 !important;
                overflow: hidden !important;
                box-shadow: none !important;
                transform: none !important;
            }
            nav, button, .no-print, .navbar {
                display: none !important;
            }
            .print-container {
                padding: 0 !important;
                margin: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                max-width: 100vw !important;
                max-height: 100vh !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                background: #020617 !important;
                overflow: hidden !important;
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                z-index: 9999999 !important;
            }
            .cert-body-style {
                width: 100% !important;
                height: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
            }
            .certificate-container { 
                box-shadow: none !important; 
                border-width: 8px !important;
                border-color: #b392ac !important;
                width: 100% !important;
                height: 100% !important;
                max-width: 100% !important;
                max-height: 100% !important;
                padding: 40px 50px !important;
                margin: 0 !important;
                position: relative !important;
                left: auto !important;
                top: auto !important;
                background: radial-gradient(circle, #0a1128 0%, #020617 100%) !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
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
        <span className="text-xs uppercase text-amber-500 font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 shadow">
          <ShieldCheck size={14} /> Academic Excellence Verification
        </span>
      </div>

      {/* Scoped CSS Wrapper for Montserrat */}
      <div ref={certRef} className="cert-body-style w-full flex justify-center">
        <div className="certificate-container">
            <div className="corner top-left"></div>
            <div className="corner top-right"></div>
            <div className="corner bottom-left"></div>
            <div className="corner bottom-right"></div>

            <img src="/logo.png" alt="Edunexus Logo" className="cert-badge-logo" />

            <div className="content">
                <div>
                    <div className="logo-area">EDUNEXUS PRO</div>
                    <div className="sub-logo">Advanced Research & Innovation Portal</div>

                    <div className="cert-title">SUMMER TRAINING COMPLETION CREDENTIALS</div>
                    <div className="conferred-text">This is proudly conferred upon the developer</div>
                </div>

                <div className="student-name">{displayData.name}</div>

                <div className="details-text">
                    Son / Daughter of Sh. <span className="highlight">{displayData.fatherName || "N/A"}</span><br />
                    representing institution: <span className="highlight">{displayData.collegeName || "N/A"}</span><br />
                    pursuing branch: <span className="highlight">{displayData.branchName || "N/A"}</span><br />
                    for successfully executing specialized summer training curriculum in
                </div>

                <div>
                    <div className="course-box">{displayData.courseName}</div>
                </div>

                <div className="duration-performance">
                    Training Duration: From <span className="highlight">{displayData.startDate}</span> To <span className="highlight">{displayData.endDate}</span>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    PERFORMANCE REVIEW: <span className="highlight" style={{ color: '#d4af37' }}>{getPerformanceReviewText(displayData.grade)}</span>
                </div>

                <div className="footer-section">
                    <div className="credential-info">
                        <div className="qr-code">
                            <QRCodeSVG 
                              value={`${window.location.origin}/verify?id=${displayData.credentialId}`} 
                              size={60}
                              level="H"
                            />
                        </div>
                        <div>
                            <strong>Credential ID:</strong> {displayData.credentialId}<br />
                            Verify credentials authenticity at:<br />
                            <span style={{ color: '#d4af37' }}>{window.location.host}/verify</span>
                        </div>
                    </div>
                    
                    <div className="signature-block">
                        <img src="/Vinayak_sign-removebg-preview.png" alt="Vinayak Singh Signature" className="ceo-signature" />
                        <hr className="signature-line" />
                        <div className="sig-title">Vinayak Singh</div>
                        <div className="sig-company">CEO & Co-Founder, EduNexus Pro</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

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
