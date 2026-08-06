import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Award, ShieldCheck, Target, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-500/20 selection:text-blue-300">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Navigation */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-blue-400 transition"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/30 border border-blue-900/40 px-2.5 py-0.5 rounded-full">
            Who We Are
          </span>
        </div>

        {/* Header Hero */}
        <div className="space-y-4 text-center sm:text-left">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase leading-none">
            Empowering the Next <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Generation of Engineers
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Discover how EduNexus Pro is bridging the gap between academic theory and practical industry excellence.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-slate-900/30 border border-slate-900/60 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl" />
          <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl" />

          {/* Mission Description */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <Target size={22} className="text-blue-400" />
              Our Mission
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              <strong>EduNexus Pro</strong> is a premier online learning platform dedicated to offering highly affordable, industry-oriented <strong>4-Week Industrial Training</strong> programs specifically designed for Engineering students.
            </p>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
              We understand the challenges faced by engineering graduates in today's competitive job market. Our curriculum is tailored to bypass traditional theoretical paths, focusing instead on practical skill-building, real-world technologies, and hands-on projects.
            </p>
          </div>

          <hr className="border-slate-900" />

          {/* Key Pillars */}
          <div className="grid gap-6 sm:grid-cols-2">
            
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/65 space-y-3 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300">
              <div className="p-2.5 bg-blue-950/40 border border-blue-900/30 text-blue-400 rounded-xl w-fit">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-white text-base">Structured Learning</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Step-by-step learning modules built by industry professionals, allowing you to learn at your own pace with maximum efficiency.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/65 space-y-3 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300">
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 rounded-xl w-fit">
                <Award size={20} />
              </div>
              <h3 className="font-bold text-white text-base">Verified Certifications</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Receive an industry-recognized Course Completion Certificate equipped with a unique verifiable link to showcase on your resume.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/65 space-y-3 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300">
              <div className="p-2.5 bg-indigo-950/40 border border-indigo-900/30 text-indigo-400 rounded-xl w-fit">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-white text-base">Affordable & Accessible</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                High-quality technical training designed to be accessible to every student, without hefty price tags.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/65 space-y-3 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300">
              <div className="p-2.5 bg-pink-950/40 border border-pink-900/30 text-pink-400 rounded-xl w-fit">
                <Heart size={20} />
              </div>
              <h3 className="font-bold text-white text-base">Student-Centric Approach</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Dedicated WhatsApp and Telegram support groups to guide you throughout your training journey and clarify queries.
              </p>
            </div>

          </div>

          <hr className="border-slate-900" />

          {/* Closing note */}
          <div className="text-center space-y-4">
            <p className="text-slate-400 text-xs sm:text-sm italic">
              "We believe that real learning happens when curiosity meets structured training. EduNexus Pro is built to guide you there."
            </p>
            <div className="pt-2">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                Join EduNexus Pro Today
              </Link>
            </div>
          </div>

        </div>

        {/* Quick Contact Support */}
        <div className="text-center pt-4 border-t border-slate-900 text-xs text-slate-400 space-y-2">
          <p>Have questions about our training tracks?</p>
          <div className="flex justify-center gap-4">
            <a href="https://chat.whatsapp.com/Ba4J77LOmzVBrlHjQtm6Ar?s=cl&p=a&mlu=1" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:underline">
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

export default About;
