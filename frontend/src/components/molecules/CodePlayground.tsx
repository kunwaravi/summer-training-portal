import React, { useState } from 'react';
import { Play, RotateCcw, Terminal, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api';

interface CodePlaygroundProps {
  initialCode: string;
  language: string;
  expectedOutput?: string;
}

// Map frontend language labels to sandbox backend language codes (issue #71).
const toSandboxLang = (label: string): string => {
  const l = label.toLowerCase();
  if (l.includes('cpp') || l.includes('c++') || l.includes('iot')) return 'cpp';
  if (l === 'c') return 'c';
  if (l.includes('python') || l.includes('micropython')) return 'python';
  if (l.includes('js') || l.includes('javascript')) return 'javascript';
  return 'c';
};

const CodePlayground: React.FC<CodePlaygroundProps> = ({
  initialCode,
  language,
  expectedOutput
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  const handleRun = async () => {
    setIsRunning(true);
    setIsSuccess(false);
    setRunError(null);
    setOutput([]);
    try {
      const res = await api.post('/sandbox/run', {
        language: toSandboxLang(language),
        code
      });
      const { stdout, stderr, exitCode, timedOut, compileError } = res.data;

      const lines: string[] = [];
      if (stdout) lines.push(...stdout.split('\n'));
      if (stderr) lines.push('', '--- stderr ---', ...stderr.split('\n'));

      if (timedOut) {
        lines.push('', '[Sandbox] Execution timed out (3s limit).');
        setRunError('Execution timed out. Check for infinite loops.');
      } else if (compileError) {
        lines.push('', '[Sandbox] Compilation failed (exit code ' + (exitCode ?? '?') + ').');
        setRunError('Compilation failed. Fix the errors and try again.');
      } else if (exitCode !== 0) {
        lines.push('', '[Sandbox] Process exited with code ' + (exitCode ?? '?') + '.');
      }

      const hasExpected = expectedOutput && stdout && stdout.trim().includes(expectedOutput.trim());
      const cleanStdout = stdout.trim();

      if (expectedOutput && cleanStdout === expectedOutput.trim()) {
        setIsSuccess(true);
      } else if (expectedOutput && hasExpected) {
        setIsSuccess(true);
      } else if (!expectedOutput && exitCode === 0) {
        // No expected output defined → success = clean exit
        setIsSuccess(true);
      }

      setOutput(lines);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to run code. Please try again.';
      setOutput([msg]);
      setRunError(msg);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput([]);
    setIsSuccess(false);
    setRunError(null);
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
            {runError && !isSuccess && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 text-red-400 font-bold"
              >
                <AlertTriangle size={10} /> Error
              </motion.span>
            )}
          </div>
          <AnimatePresence>
            {output.length === 0 ? (
              <span className="text-slate-700 italic">Click "Run Code" to execute in the sandbox...</span>
            ) : (
              output.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={line === '--- stderr ---' ? 'text-yellow-500 font-bold' : 'text-slate-500'}
                >
                  {line || ' '}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-slate-900/40 px-4 py-2 text-[9px] text-slate-500 border-t border-slate-900 flex justify-between">
        <span>Real execution sandbox · 3s timeout · 256 MB heap · rate-limited</span>
        <span>Environment: Isolated Process</span>
      </div>
    </div>
  );
};

export default CodePlayground;
