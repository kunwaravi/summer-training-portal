import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, BookOpen, Award, Shield } from 'lucide-react';

const Terms = () => {
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2.5 py-0.5 rounded-full">
            Terms of Service
          </span>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Terms & <span className="text-indigo-400">Conditions</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
            Last Updated: June 2026 • Edunexus Automation Labs (Faridabad, Haryana)
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900/30 border border-slate-900/60 rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-sm">
          
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale size={18} className="text-indigo-400" />
              1. Agreement to Terms
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              Welcome to <strong>Edunexus Labs</strong> (operating under Edunexus Automation Labs, Faridabad, Haryana). By registering on our website, purchasing our training tracks, or using our course materials, you agree to follow these simple terms.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield size={18} className="text-indigo-400" />
              2. Student Registration & Conduct
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              You must provide accurate details like your real name, college name, and email during registration. Using fake details, incorrect payment reference numbers (UTRs), or trying to bypass verification will result in your account being suspended and certificate invalidation.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-400" />
              3. Copyright & Study Material
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              All training resources, codes, quizzes, and notes provided on this platform are owned by <strong>Edunexus Automation Labs</strong>. You can use them for personal learning, but you are not allowed to resell, distribute, or share paid materials online.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award size={18} className="text-indigo-400" />
              4. Certification Policy
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              Our verified training certificates are issued only when you complete all course topics, score the required passing marks in quizzes, and clear manual payment audits. Every certificate has a unique ID that can be verified live on our site.
            </p>
          </div>

        </div>

        {/* Quick Contact Support */}
        <div className="text-center pt-4 border-t border-slate-900 text-xs text-slate-400 space-y-2">
          <p>Need any help or have questions about our terms?</p>
          <div className="flex justify-center gap-4">
            <a href="https://chat.whatsapp.com/Ba4J77LOmzVBrlHjQtm6Ar?s=cl&p=a&mlu=1" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-400 hover:underline">
              WhatsApp Group Support
            </a>
            <span>•</span>
            <a href="https://t.me/+tCapxtLwxNNlZjY1" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-400 hover:underline">
              Telegram Chat Support
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Terms;
