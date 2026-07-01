import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, ShieldAlert, BookOpen, Award, Shield, FileEdit } from 'lucide-react';

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
            Last Updated: June 2026 • EduNexus Pro
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900/30 border border-slate-900/60 rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-sm">
          
          {/* 1. Agreement to Terms */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale size={18} className="text-indigo-400" />
              1. Agreement to Terms
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              By accessing, browsing, registering, or using the <strong>EduNexus Pro</strong> website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you are not authorized to use this platform.
            </p>
          </div>

          {/* 2. Course Access & Account Policy */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield size={18} className="text-indigo-400" />
              2. Student Access & Account Sharing
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              Course access is granted exclusively to the registered student who purchased the program. Account sharing is <strong>strictly prohibited</strong>. Any attempt to share credentials, distribute login details, or bypass security validation to allow concurrent usage will result in immediate account suspension, access revocation, and invalidation of any certificates earned.
            </p>
          </div>

          {/* 3. Intellectual Property */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-400" />
              3. Copyright & Intellectual Property
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              All learning resources, videos, slides, source codes, practice arena materials, quiz banks, and documentation provided on this platform are the exclusive intellectual property of <strong>EduNexus Pro</strong>. Copying, recording, screen-capturing, republishing, uploading, distributing, or selling any course content online or offline is strictly prohibited and may attract legal action.
            </p>
          </div>

          {/* 4. Certification Policy */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award size={18} className="text-indigo-400" />
              4. Certification Policy
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              Course Completion Certificates are issued only after the student has successfully completed the required training modules, answered mandatory topics, passed corresponding quizzes, and cleared the internal payment verification audit. Certificates contain a unique ID that remains verifiable live on our database.
            </p>
          </div>

          {/* 5. Policy Updates & Pricing */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileEdit size={18} className="text-indigo-400" />
              5. Right to Update Content & Pricing
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              <strong>EduNexus Pro</strong> reserves the right to update, modify, or discontinue course curriculum, training tracks, pricing details, and policies at any time without prior notice.
            </p>
          </div>

          {/* 6. Misuse & Termination */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-indigo-400" />
              6. Misuse & Account Termination
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              Any misuse of the platform (including spamming, entering fake UTR payment reference numbers, attempting code injection/SQL injection, harassing support staff, or copying intellectual property) will lead to immediate account suspension or permanent termination of access with no refund eligibility.
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
