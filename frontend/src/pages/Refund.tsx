import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCcw, Landmark, AlertCircle } from 'lucide-react';

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
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/30 border border-red-900/40 px-2.5 py-0.5 rounded-full">
            Refund Rules
          </span>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Refund <span className="text-red-400">Policy</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
            Last Updated: June 2026 • Edunexus Automation Labs (Faridabad, Haryana)
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900/30 border border-slate-900/60 rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-sm">
          
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCcw size={18} className="text-red-400" />
              1. Digital Content Unlock Rules
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              Because our premium video recordings, hardware notes, codes, and verified training certifications are instantly unlocked upon payment verification, all completed activations are final and <strong>non-refundable</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle size={18} className="text-red-400" />
              2. Failed or Rejected Transactions
            </h2>
            <div className="text-slate-350 text-xs sm:text-sm leading-relaxed space-y-2">
              <p>
                If you made a payment via UPI but your transaction was rejected, is taking too long to unlock, or you typed the UTR number wrong:
              </p>
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-indigo-300 text-xs font-semibold leading-relaxed">
                <strong>Instant Action:</strong> Message our official <a href="https://t.me/+tCapxtLwxNNlZjY1" target="_blank" rel="noopener noreferrer" className="underline hover:text-white font-bold">Telegram Support Group</a> with your Email ID, payment reference number, and transaction screenshot. Our team will verify it live and activate it immediately!
              </div>
              <p>
                If the payment failed on your bank server's end, the deducted amount will automatically revert back to your bank account within <strong>5-7 working days</strong>.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Landmark size={18} className="text-red-400" />
              3. Duplicate Payments
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              If you paid twice for the same training track by mistake due to internet network issues, message the WhatsApp support group or Telegram group. We will verify the duplicate entry and return the extra amount back to your UPI/bank source within <strong>7-10 working days</strong>.
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
