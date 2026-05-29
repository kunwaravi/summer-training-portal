import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ShieldCheck, ShieldAlert, FileSearch, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Verify = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const initialId = query.get('id') || query.get('credentialId') || '';

  const [credentialId, setCredentialId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Auto-verify if "id" query parameter is passed in URL
  useEffect(() => {
    if (initialId) {
      handleVerify(initialId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  async function handleVerify(idToVerify: string) {
    const targetId = idToVerify || credentialId;
    if (!targetId.trim()) {
      setError('Please enter a valid Credential ID.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.get(`/certificate/verify/${targetId.trim()}`);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. No matching registered candidate found.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-8 max-w-3xl mx-auto px-4 space-y-8">
      
      {/* Top Header Navigation */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 no-print">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Exit Registry
        </button>
        <span className="text-[10px] tracking-widest text-slate-400 font-bold uppercase bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
          NEXUS CORPORATE AUDIT BOARD
        </span>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Faint mesh background decoration */}
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none"></div>

        {/* Branding header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-500/5 border border-amber-500/20 px-3 py-1 rounded-full">
            <Building2 size={14} /> Corporate Verification Registry
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mt-2">
            NEXUS EMBEDDED SYSTEMS & IoT SOLUTIONS
          </h2>
          <p className="text-slate-450 text-[10px] font-bold uppercase tracking-widest">
            ISO 9001:2015 & ISO/IEC 27001 Certified Academic Audit Console
          </p>
        </div>

        {/* Verification Form */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80 no-print">
          <label className="text-xs font-bold text-slate-350 block uppercase tracking-wider pl-1">
            Enter Certificate / Credential ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text"
              placeholder="e.g. NEX-CPP_EMBEDDED-AVIN1001-VERIFIED"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm tracking-wide shadow-inner"
            />
            <button
              onClick={() => handleVerify('')}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm rounded-xl transition flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
              ) : (
                <><FileSearch size={18} /> Audit Code</>
              )}
            </button>
          </div>
        </div>

        {/* Results / Audit Output */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-6 mt-4"
            >
              {/* Verification Header Badge */}
              <div className="flex items-center gap-3 pb-4 border-b border-emerald-500/20">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
                    STATUS: SECURED & VERIFIED
                  </h4>
                  <p className="text-slate-400 text-[10px] font-mono tracking-tight mt-0.5">
                    REGISTRY REF: {credentialId.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Verified Details Sheet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-900">
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">Candidate Name</span>
                  <span className="font-bold text-white text-base mt-0.5 block">{result.candidateName}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-900">
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">Enrolled Institution</span>
                  <span className="font-bold text-white uppercase mt-0.5 block">{result.collegeName}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-900">
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">Academic Branch</span>
                  <span className="font-bold text-white mt-0.5 block">{result.branchName} Engineering</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-900">
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">Accredited Specialization</span>
                  <span className="font-bold text-amber-400 mt-0.5 block">{result.courseName}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-900">
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">Audit Grade</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">OUTSTANDING (GRADE {result.grade})</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-900">
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">Date of Certification</span>
                  <span className="font-bold text-white mt-0.5 block">{result.completionDate}</span>
                </div>
              </div>

              {/* Legal / Corporate Accreditation Stamp */}
              <div className="p-4 rounded-lg bg-slate-950/30 border border-slate-800 text-[10px] text-slate-450 leading-relaxed space-y-1.5 font-sans">
                <p className="flex items-center gap-2 text-slate-300 font-bold">
                  <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  Nexus Corporate Registry Audit Statement:
                </p>
                <p>
                  This digital credential has been audited and registered under the **{result.accreditationRegistry}**. The candidate has successfully met all training competency milestones and passed all weekly examinations in accordance with **{result.compliance}**.
                </p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3 mt-4 text-xs sm:text-sm"
            >
              <ShieldAlert className="text-red-400 shrink-0 mt-0.5" size={20} />
              <div>
                <strong className="text-red-400 font-bold block mb-0.5">Audit Exception: Registry Mismatch</strong>
                <span className="text-slate-350">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ISO Certified and Corporate Registration Footer Stamp */}
      <div className="text-center text-[10px] text-slate-500 space-y-1 border-t border-slate-850 pt-6">
        <p>NEXUS Embedded Systems & IoT Solutions Corporate Registry Console</p>
        <p>CIN: U72900DL2026PTC394820 | Registered Industrial Training Hub</p>
        <p className="text-[9px] text-slate-650 mt-1 uppercase font-mono tracking-tighter">
          ISO 9001:2015 & ISO/IEC 27001 Certified System Operations
        </p>
      </div>
    </div>
  );
};

export default Verify;
