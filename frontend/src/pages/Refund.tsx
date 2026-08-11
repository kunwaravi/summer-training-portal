import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCcw, Landmark, AlertCircle, ShieldAlert } from 'lucide-react';

const Refund = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/20 selection:text-emerald-300">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-450 transition"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/30 border border-red-900/40 px-2.5 py-0.5 rounded-full">
            Refund & Cancellation
          </span>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Refund & <span className="text-red-400">Cancellation Policy</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
            Last Updated: June 2026 • EduNexus Pro
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900/30 border border-slate-900/60 rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-sm">
          
          {/* 1. General Refund Policy */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCcw size={18} className="text-red-400" />
              1. General Course Purchase Rules
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              Because our premium video recordings, study resources, practices, and automated verified certifications are instantly unlocked and made accessible upon successful payment verification, course fees are generally <strong>non-refundable</strong> after a successful purchase.
            </p>
          </div>

          {/* 2. Cancellation Requests */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-400" />
              2. Cancellation Requests
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              Cancellation requests submitted after course access has been granted to the student's account are generally not eligible for a refund, unless explicitly required by applicable law or consumer protection regulations.
            </p>
          </div>

          {/* 3. Duplicate Payments */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Landmark size={18} className="text-red-400" />
              3. Duplicate Payments
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              If you paid twice for the same training track by mistake due to internet lag or session timeout issues:
            </p>
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900/80 text-slate-300 text-xs sm:text-sm leading-relaxed">
              Please message our support desk with your Email ID, transaction reference numbers (UTR), and screenshots. Once verified, the duplicate amount will be refunded and credited back to your original payment source within <strong>7-10 working days</strong>.
            </div>
          </div>

          {/* 4. Technical Issues */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle size={18} className="text-red-400" />
              4. Technical Access Issues
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              If your payment was successful but your course is not unlocked, or if you encounter any technical loading issues while accessing the training, please report it to our support team immediately. Technical access problems will be prioritized and resolved by the support team as quickly as possible.
            </p>
          </div>

        </div>

        {/* Quick Contact Support */}
        <div className="text-center pt-4 border-t border-slate-900 text-xs text-slate-400 space-y-2">
          <p>Need support or refund clarification?</p>
          <div className="flex justify-center gap-4">
            <a href="https://chat.whatsapp.com/Ba4J77LOmzVBrlHjQtm6Ar?s=cl&p=a&mlu=1" target="_blank" rel="noopener noreferrer" className="font-semibold text-red-400 hover:underline">
              WhatsApp Group Support
            </a>
            <span>•</span>
            <a href="https://t.me/+tCapxtLwxNNlZjY1" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-400 hover:underline">
              Telegram Chat Support
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Refund;
