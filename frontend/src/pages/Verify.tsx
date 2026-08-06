import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ShieldCheck, ShieldAlert, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Verify = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const initialId = query.get('id') || query.get('credentialId') || '';
  const token = query.get('token') || '';

  const inputRef = useRef<HTMLInputElement>(null);

  const [credentialId, setCredentialId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [error, setError] = useState('');

  // Email verification state hooks
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailVerificationError, setEmailVerificationError] = useState('');
  const [emailVerificationSuccess, setEmailVerificationSuccess] = useState(false);

  // Auto-verify if "id" query parameter is passed in URL
  useEffect(() => {
    if (initialId) {
      handleVerify(initialId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  // Handle email verification flow if token is present
  useEffect(() => {
    if (token) {
      handleEmailVerification(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleEmailVerification(verificationToken: string) {
    setVerifyingEmail(true);
    setEmailVerificationError('');
    setEmailVerificationSuccess(false);
    try {
      await api.get('/auth/verify', { params: { token: verificationToken } });
      setEmailVerificationSuccess(true);
    } catch (err: any) {
      setEmailVerificationError(err.response?.data?.message || 'Email verification failed. The token is invalid or has expired.');
    } finally {
      setVerifyingEmail(false);
    }
  }

  async function handleVerify(idToVerify: string) {
    const targetId = idToVerify || credentialId;
    if (!targetId.trim()) {
      setError('Please enter a valid Credential ID.');
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setCourseDetails(null);

    try {
      const res = await api.get(`/certificate/verify/${targetId.trim()}`);
      setResult(res.data);

      // Fetch course curriculum details
      if (res.data.courseId) {
        try {
          const courseRes = await api.get(`/courses/${res.data.courseId}/public`);
          setCourseDetails(courseRes.data);
        } catch (courseErr) {
          console.error('Failed to fetch course details:', courseErr);
          // Continue without course details - don't block the certificate display
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. No matching registered candidate found.');
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify('');
  };

  // Email verification (token) branch
  if (token) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-center">
          <AnimatePresence mode="wait">
            {verifyingEmail ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 py-8"
              >
                <Loader2 size={40} className="animate-spin text-amber-400 mx-auto" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Verifying your account…</h3>
                <p className="text-xs text-slate-400">Confirming your registration token.</p>
              </motion.div>
            ) : emailVerificationSuccess ? (
              <motion.div
                key="success"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="space-y-6 py-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 size={36} className="animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">Account Verified!</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Welcome to EduNexus Pro! Your email has been validated. You can now log in to access your curriculum.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition shadow active:scale-[0.98]"
                >
                  Proceed to Login
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="error"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="space-y-6 py-6"
              >
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                  <ShieldAlert size={36} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-rose-400 uppercase tracking-wider">Verification Failed</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {emailVerificationError || 'The verification token provided is invalid or has expired.'}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition border border-slate-700 active:scale-[0.98]"
                >
                  Back to Registration
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Credential verification branch
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Branding header */}
      <div className="text-center mb-8">
        <p className="text-amber-400 font-black tracking-[0.35em] uppercase text-sm mb-2">EduNexus Pro</p>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Credential Verification</h1>
        <p className="text-slate-400 text-sm mt-2">Verify the authenticity of an EduNexus Pro certificate</p>
      </div>

      {/* Verification card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={onSubmit} className="space-y-3">
          <label htmlFor="credential-input" className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
            Credential ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="credential-input"
              ref={inputRef}
              type="text"
              placeholder="e.g. NEX-CPP_EMBEDDED-AVIN1001-VERIFIED"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm tracking-wide shadow-inner"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <><Search size={18} /> Verify Credential</>
              )}
            </button>
          </div>
          {!result && !error && (
            <p className="text-[11px] text-slate-500 pl-1">
              Enter the credential ID printed on your certificate to confirm its authenticity.
            </p>
          )}
        </form>

        <AnimatePresence mode="wait">
          {/* Success panel */}
          {result && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 mt-6"
            >
              <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-3 pb-4 border-b border-emerald-500/20">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h4 className="text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
                      Credential Verified
                    </h4>
                    <p className="text-slate-400 text-[11px] font-mono tracking-tight mt-0.5 break-all">
                      {credentialId.trim().toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-900">
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">Candidate Name</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">{result.candidateName}</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-900">
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">Institution</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">{result.collegeName}</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-900">
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">Branch</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">{result.branchName}</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-900">
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">Course</span>
                    <span className="font-bold text-amber-400 text-sm mt-0.5 block">{result.courseName}</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-900">
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">Grade</span>
                    <span className="font-bold text-emerald-400 text-sm mt-0.5 block">GRADE {result.grade}</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-900">
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">Certification Date</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">{result.completionDate}</span>
                  </div>
                </div>
              </div>

              {/* Course curriculum */}
              {courseDetails && courseDetails.modules?.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
                    <CheckCircle2 size={14} />
                    Course Curriculum Completed
                  </div>
                  <div className="space-y-2">
                    {courseDetails.modules.map((module: any) => (
                      <div key={module.week} className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-white">Week {module.week}: {module.title}</p>
                            <p className="text-slate-500 text-[11px] mt-0.5">{module.description}</p>
                          </div>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30 whitespace-nowrap">
                            {module.topicCount} topics
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => { setResult(null); setCredentialId(''); inputRef.current?.focus(); }}
                className="text-xs text-slate-500 hover:text-slate-300 transition font-semibold"
              >
                Verify another credential
              </button>
            </motion.div>
          )}

          {/* Error panel */}
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 rounded-xl border border-rose-500/20 bg-rose-500/5 mt-6 space-y-3"
            >
              <div className="flex items-start gap-3">
                <ShieldAlert className="text-rose-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <strong className="text-rose-400 font-bold block mb-0.5">Verification Failed</strong>
                  <span className="text-slate-400 text-sm">{error}</span>
                </div>
              </div>
              <button
                onClick={() => { setError(''); inputRef.current?.focus(); }}
                className="text-xs text-slate-400 hover:text-white transition font-semibold"
              >
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Verify;
