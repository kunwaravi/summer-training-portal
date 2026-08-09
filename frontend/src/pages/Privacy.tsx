import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, Lock, FileKey, ShieldAlert, Cookie, UserCheck } from 'lucide-react';

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
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2.5 py-0.5 rounded-full">
            Data Privacy
          </span>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Privacy <span className="text-emerald-400">Policy</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
            Last Updated: June 2026 • EduNexus Pro
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900/30 border border-slate-900/60 rounded-2xl p-6 sm:p-8 space-y-8 backdrop-blur-sm">
          
          {/* 1. Information We Collect */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye size={18} className="text-emerald-400" />
              1. Information We Collect
            </h2>
            <p className="text-slate-355 text-xs sm:text-sm leading-relaxed">
              We collect the following personal and academic details from you when you register and enroll on our platform:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs sm:text-sm">
              <li><strong>Personal Identifiers:</strong> Your Full Name, Email Address, and Mobile Number.</li>
              <li><strong>Enrollment Details:</strong> College Name, Department/Branch, and training track choice.</li>
              <li><strong>Payment Information:</strong> UPI ID, transaction Reference Number (UTR), or other details necessary to verify course enrollment and process purchases securely.</li>
            </ul>
          </div>

          {/* 2. Purpose of Collection */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck size={18} className="text-emerald-400" />
              2. Purpose of Collecting Data
            </h2>
            <p className="text-slate-355 text-xs sm:text-sm leading-relaxed">
              The data we collect is utilized strictly for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs sm:text-sm">
              <li>Setting up and managing your student account.</li>
              <li>Providing and unlocking course materials, tracking quiz progress, and generating verified Course Completion Certificates.</li>
              <li>Verifying payment records to activate training access.</li>
              <li>Communicating important updates, training schedules, and support responses.</li>
            </ul>
          </div>

          {/* 3. Secure Storage of Information */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock size={18} className="text-emerald-400" />
              3. Secure Data Storage
            </h2>
            <p className="text-slate-355 text-xs sm:text-sm leading-relaxed">
              Your personal information is stored securely in encrypted databases and protected by industry-standard security protocols. We take comprehensive technical measures to guard your data against unauthorized access, loss, misuse, or alteration.
            </p>
          </div>

          {/* 4. No Selling of Personal Information */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-emerald-400" />
              4. Zero Third-Party Selling Policy
            </h2>
            <p className="text-slate-355 text-xs sm:text-sm leading-relaxed">
              We strictly enforce a <strong>No Selling Policy</strong>. We will never sell, rent, lease, or trade your personal information, email address, or contact details to third-party marketing agencies or external brokers.
            </p>
          </div>

          {/* 5. Limited Sharing */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileKey size={18} className="text-emerald-400" />
              5. Limited Sharing & Disclosures
            </h2>
            <p className="text-slate-355 text-xs sm:text-sm leading-relaxed">
              Your information is shared only under the following strict conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs sm:text-sm">
              <li><strong>Payment Providers:</strong> Sharing verified payment identifiers with UPI/gateway operators to securely process and verify transactions.</li>
              <li><strong>Legal Obligations:</strong> When required by applicable law, court order, or regulatory authorities.</li>
            </ul>
          </div>

          {/* 6. Cookie Usage */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cookie size={18} className="text-emerald-400" />
              6. Cookie Usage
            </h2>
            <p className="text-slate-355 text-xs sm:text-sm leading-relaxed">
              We use functional cookies and browser storage (such as <code className="text-emerald-400 bg-emerald-950/20 px-1 py-0.5 rounded font-mono">localStorage</code>) to enhance your user experience. These include remembering your login session, dark/light theme preferences, and course checkbox progress. You can disable cookies in your browser settings, but it may affect some features of the platform.
            </p>
          </div>

          {/* 7. User Rights */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck size={18} className="text-emerald-400" />
              7. Your Rights
            </h2>
            <p className="text-slate-355 text-xs sm:text-sm leading-relaxed">
              As a user, you have the right to request access to the personal data we store, request updates or corrections to any incorrect information, or request the deletion of your account (subject to active enrollment verification). To exercise these rights, you can reach out to our official support email.
            </p>
          </div>

        </div>

        {/* Quick Contact Support */}
        <div className="text-center pt-4 border-t border-slate-900 text-xs text-slate-400 space-y-2">
          <p>Have questions about your personal data privacy?</p>
          <div className="flex justify-center gap-4">
            <a href="https://chat.whatsapp.com/Ba4J77LOmzVBrlHjQtm6Ar?s=cl&p=a&mlu=1" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-400 hover:underline">
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

export default Privacy;
