import React from 'react';
import { Award, Check, ShieldAlert, Sparkles, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnrollmentPanelProps {
  courseId: string | undefined;
  user: any;
  isPaid: boolean;
  /** Kept for API compatibility — /pay page now owns the payment flow. */
  onPaymentSuccess: () => void;
  navigate: (path: string) => void;
}

const EnrollmentPanel: React.FC<EnrollmentPanelProps> = ({
  courseId,
  user,
  isPaid,
  navigate
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-10 p-8 rounded-2xl relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-yellow-500/30 shadow-xl shadow-yellow-500/5"
    >
      <div className="absolute top-3 left-4 text-yellow-500/5 text-7xl select-none font-serif">★</div>
      <div className="absolute bottom-3 right-4 text-yellow-500/5 text-7xl select-none font-serif">★</div>

      {!isPaid ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="relative group/cert select-none">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 rounded-xl blur-lg opacity-60 group-hover/cert:opacity-90 transition duration-500"></div>
            <div className="relative border-4 border-yellow-500/40 p-4 rounded-xl bg-slate-900 aspect-[1.41/1] overflow-hidden flex flex-col justify-between items-center text-center filter blur-[4px] contrast-75 brightness-75 select-none pointer-events-none">
              <div className="text-[11px] tracking-widest text-slate-500 font-extrabold uppercase">Nexus Academic Credentials</div>
              <div className="my-auto space-y-1">
                <h3 className="text-yellow-500/60 font-serif font-black text-sm uppercase tracking-wide">Certificate of Accomplishment</h3>
                <p className="text-[11px] text-slate-400">Awarded to the candidate</p>
                <p className="text-xs font-bold text-white tracking-tight underline underline-offset-4">{user?.name || "STUDENT NAME"}</p>
                <p className="text-[11px] text-slate-500 max-w-[200px] leading-tight mx-auto">for completing the intensive training curriculum in C & Embedded Systems Hardware tracks.</p>
              </div>
              <div className="w-full flex justify-between items-center text-[11px] text-slate-650 px-2 font-mono">
                <div>DATE: 2026-05-29</div>
                <div>GRADE: A+</div>
              </div>
            </div>
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded text-[11px] font-black tracking-widest uppercase rotate-[-12deg] shadow-lg shadow-black/80">
                Provisional Preview - Locked 🔒
              </span>
            </div>
          </div>

          <div className="space-y-5 text-left">
            <div className="flex items-center gap-2 text-yellow-400">
              <Award size={24} className="animate-bounce" />
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">Unlock Your Verified Certificate 🎓</h2>
            </div>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              Congratulations! You have completed all course curriculum modules and passed the final examinations. Your credential is ready to be authorized and published.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300 font-bold bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
              {[
                "Industry Standard Curriculum",
                "Verifiable Online Registry Entry",
                "One-Click Shareable to LinkedIn",
                "Durable High-Res Printable Format"
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={() => navigate(`/pay/${encodeURIComponent(courseId || '')}`)}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/25 transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-xs uppercase tracking-widest inline-flex items-center justify-center gap-2"
              >
                <CreditCard size={16} />
                Unlock Official Credentials (₹699)
              </button>
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                <ShieldAlert size={14} /> Secure UPI Payment
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center relative z-10 space-y-6 py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <Sparkles size={32} className="animate-spin-slow" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 tracking-tight">Credentials Verified & Active! 🎓</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Your payment was verified by our team and your secure certification credentials have been generated. You can now download, print, or share your verifiable training certificate.
          </p>
          <button
            onClick={() => navigate(`/certificate?courseId=${encodeURIComponent(courseId || '')}`)}
            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-yellow-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
          >
            Open High-Resolution Certificate
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default EnrollmentPanel;
