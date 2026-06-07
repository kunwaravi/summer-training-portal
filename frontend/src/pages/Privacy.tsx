import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, FileKey } from 'lucide-react';

const Privacy = () => {
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/30 border border-indigo-900/40 px-2.5 py-0.5 rounded-full">
            Data Privacy
          </span>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Privacy <span className="text-emerald-400">Policy</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
            Last Updated: June 2026 • Edunexus Automation Labs (Faridabad, Haryana)
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900/30 border border-slate-900/60 rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-sm">
          
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye size={18} className="text-emerald-400" />
              1. What Data We Collect
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              We collect minimal information to help you learn and track your progress:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs sm:text-sm">
              <li>Your Name, Email, College Name, and Branch (for generating accurate certificates).</li>
              <li>Your Course Progress, Quiz Scores, and Payment UTR numbers (for course activation).</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock size={18} className="text-emerald-400" />
              2. Absolute Privacy & No Spam
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              We have a strict <strong>Zero Third-Party Sharing Policy</strong>. We will never sell, share, or rent your email address or academic details to any external marketing agencies or brokers. Your data is 100% safe and encrypted.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileKey size={18} className="text-emerald-400" />
              3. Local Storage Usage
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              We use secure browser cache storage (<code className="text-emerald-400 bg-emerald-950/20 px-1 py-0.5 rounded font-mono">localStorage</code>) to keep you logged in, remember your Dark/Light theme preferences, and sync your course checkboxes. These items remain locally inside your device.
            </p>
          </div>

        </div>

        {/* Quick Contact Support */}
        <div className="text-center pt-4 border-t border-slate-900 text-xs text-slate-400 space-y-2">
          <p>Have questions about your personal data privacy?</p>
          <div className="flex justify-center gap-4">
            <a href="mailto:privacy@edunexus.in" className="font-semibold text-emerald-400 hover:underline">
              privacy@edunexus.in
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

export default Privacy;
