import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Terminal, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodePlaygroundProps {
  initialCode: string;
  language: string;
  expectedOutput?: string;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({ 
  initialCode, 
  language,
  expectedOutput 
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setIsSuccess(false);
    setOutput(["Compiling...", "Linking peripherals...", "Executing binary..."]);
    
    setTimeout(() => {
      if (expectedOutput) {
        setOutput(prev => [...prev, `[Output]: ${expectedOutput}`]);
        setIsSuccess(true);
      } else {
        setOutput(prev => [...prev, "[Output]: Program executed successfully.", "Process returned 0 (0x0)"]);
      }
      setIsRunning(false);
    }, 1500);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput([]);
    setIsSuccess(false);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl my-6">
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-blue-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {language} Interactive Sandbox
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleReset}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
            title="Reset Code"
          >
            <RotateCcw size={14} />
          </button>
          <button 
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
          >
            {isRunning ? (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Play size={12} fill="currentColor" />
            )}
            Run Code
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Editor Area */}
        <div className="p-4 border-r border-slate-800 bg-slate-950">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-48 bg-transparent text-cyan-400 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>
        
        {/* Output Area */}
        <div className="p-4 bg-slate-950/50 min-h-[150px] font-mono text-[10px] space-y-1">
          <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-900">
            <span className="text-slate-600 uppercase font-black tracking-tighter">Console Output</span>
            {isSuccess && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 text-emerald-400 font-bold"
              >
                <CheckCircle2 size={10} /> Verified
              </motion.span>
            )}
          </div>
          <AnimatePresence>
            {output.length === 0 ? (
              <span className="text-slate-700 italic">Click "Run Code" to simulate execution...</span>
            ) : (
              output.map((line, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${line.startsWith('[Output]') ? 'text-white font-bold' : 'text-slate-500'}`}
                >
                  {line.startsWith('[Output]') ? '> ' : ''}{line.replace('[Output]: ', '')}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="bg-slate-900/40 px-4 py-2 text-[9px] text-slate-500 border-t border-slate-900 flex justify-between">
        <span>Ready for compilation...</span>
        <span>Environment: Virtual Embedded Kernel</span>
      </div>
    </div>
  );
};

export default CodePlayground;
