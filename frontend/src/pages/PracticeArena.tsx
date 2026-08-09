import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useUI } from '../context/UIContext';
import { Trophy, Timer, ChevronLeft, ChevronRight, CheckCircle2, XCircle, ArrowLeft, RefreshCw, Award } from 'lucide-react';
import Skeleton from '../components/atoms/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import CodePlayground from '../components/molecules/CodePlayground';

interface Question {
  id: number;
  category: string;
  topic: string;
  difficulty: string;
  text: string;
  options: string[];
}

interface FeedbackItem {
  questionId: number;
  text: string;
  topic: string;
  difficulty: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
}

const codingTemplates = {
  C: {
    language: 'C',
    initialCode: `#include <stdio.h>\n// System register masking exercise\n// Task: Set bit 3 and bit 0 of the Control Register (SYS_CTRL_REG)\n\nunsigned int mock_register = 0x00;\n#define SYS_CTRL_REG mock_register\n\nint main() {\n    // TODO: Write your register bitmasking solution here\n    SYS_CTRL_REG |= (1 << 3) | (1 << 0);\n    \n    printf("Registers configured. Value: 0x%X\\n", SYS_CTRL_REG);\n    return 0;\n}`,
    expectedOutput: 'Registers configured. Value: 0x9'
  },
  'C++': {
    language: 'C++',
    initialCode: `#include <iostream>\n// OOP Embedded optimization exercise\n// Task: Instantiate TempSensor with a value of 24.5 and output it.\n\nclass TempSensor {\nprivate:\n    float temp;\npublic:\n    TempSensor(float t) : temp(t) {}\n    float getCelsius() const { return temp; }\n};\n\nint main() {\n    // TODO: Complete class instantiation\n    TempSensor sensor(24.5);\n    \n    std::cout << "Sensor temperature: " << sensor.getCelsius() << " C" << std::endl;\n    return 0;\n}`,
    expectedOutput: 'Sensor temperature: 24.5 C'
  },
  IoT: {
    language: 'C++ (IoT)',
    initialCode: `#include <stdio.h>\n// ESP32 WiFi and MQTT publish simulation\n// Task: Initialize setup and print MQTT published event.\n\nvoid setup() {\n    printf("ESP32 setup: Initializing WiFi connection...\\n");\n    printf("ESP32 setup: Connecting to MQTT Broker...\\n");\n}\n\nint main() {\n    setup();\n    // TODO: Publish sensor payload\n    printf("MQTT Published: topic=sensors/temp payload=24.5\\n");\n    return 0;\n}`,
    expectedOutput: 'MQTT Published: topic=sensors/temp payload=24.5'
  }
};

const PracticeArena = () => {
  const [mode, setMode] = useState<'mcq' | 'coding'>('mcq');
  const [selectedLang, setSelectedLang] = useState<'C' | 'C++' | 'IoT'>('C');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { confirmDialog } = useUI();
  const category = searchParams.get('category') || 'Programming';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    totalQuestions: number;
    accuracy: number;
    pointsEarned: number;
    breakdown: FeedbackItem[];
  } | null>(null);

  // Callbacks defined first
  const handleOptionSelect = useCallback((questionId: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  }, []);

  const submitTest = useCallback(async (force = false) => {
    if (!force) {
      const answeredCount = Object.keys(answers).length;
      if (answeredCount < questions.length) {
        const ok = await confirmDialog({
          title: 'Submit partial set?',
          message: `You have only answered ${answeredCount} of ${questions.length} questions. Unanswered questions will be marked incorrect.`,
          confirmLabel: 'Submit Anyway',
          danger: true,
        });
        if (!ok) return;
      } else {
        const ok = await confirmDialog({
          title: 'Submit practice set?',
          message: 'Are you ready to submit your practice test?',
          confirmLabel: 'Submit',
        });
        if (!ok) return;
      }
    }

    setSubmitting(true);
    try {
      const res = await api.post('/practice/submit', {
        category,
        answers,
      });

      setResults(res.data);

      if (res.data.accuracy >= 65) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#60a5fa', '#f59e0b'],
        });
      }
    } catch (err) {
      console.error('Failed to submit practice test:', err);
      alert('An error occurred during submission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [answers, questions.length, category, confirmDialog]);

  const handleAutoSubmit = useCallback(() => {
    alert("Time is up! Your practice test is being submitted automatically.");
    submitTest(true);
  }, [submitTest]);

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/practice/questions?category=${category}`);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error('Failed to fetch practice questions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [category]);

  // Countdown Timer
  useEffect(() => {
    if (loading || results || timeLeft <= 0) {
      if (timeLeft === 0 && !results && !submitting) {
        // Auto-submit on timeout
        handleAutoSubmit();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, results, timeLeft, submitting, handleAutoSubmit]);

  const handleRetry = () => {
    setAnswers({});
    setResults(null);
    setCurrentIdx(0);
    setTimeLeft(900);
    window.scrollTo(0, 0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // #46 — 3-tier timer cue: ok (emerald) → warn (amber, last 2 min) → critical (red, last 60s).
  const timerTier = timeLeft <= 60 ? 'critical' : timeLeft <= 120 ? 'warn' : 'ok';
  const timerColors: { icon: string; text: string; bar: string; ring: string } = {
    ok: {
      icon: 'text-emerald-600 dark:text-emerald-400',
      text: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-emerald-500 dark:bg-emerald-400',
      ring: 'border-slate-200 dark:border-slate-850',
    },
    warn: {
      icon: 'text-amber-500 animate-pulse',
      text: 'text-amber-600 dark:text-amber-400',
      bar: 'bg-amber-500',
      ring: 'border-amber-300 dark:border-amber-500/40',
    },
    critical: {
      icon: 'text-rose-500 animate-pulse',
      text: 'text-rose-600 dark:text-rose-400',
      bar: 'bg-rose-500',
      ring: 'border-rose-400 dark:border-rose-500/50 shadow-lg shadow-rose-500/10',
    },
  }[timerTier];
  const timeFrac = Math.max(timeLeft / 900, 0);

  if (loading) {
    return (
      <div className="py-6 max-w-5xl mx-auto px-4 space-y-6" role="status" aria-label="Loading practice arena">
        <span className="sr-only">Loading questions…</span>
        {/* breadcrumb + timer pill */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-9 w-28 rounded-2xl" />
        </div>
        {/* header */}
        <div className="text-center space-y-3">
          <Skeleton className="h-5 w-44 mx-auto rounded-full" />
          <Skeleton className="h-8 w-72 max-w-full mx-auto" />
          <Skeleton className="h-4 w-96 max-w-full mx-auto" />
        </div>
        {/* mode switcher */}
        <Skeleton className="h-14 w-72 max-w-full mx-auto rounded-2xl" />
        {/* navigator + question card */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-5 gap-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-24 rounded-2xl" />
          </div>
          <div className="lg:col-span-3">
            <Skeleton className="h-72 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">No Questions Available</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Practice questions for the {category} category are not currently seeded.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold py-2.5 px-6 rounded-xl transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-6 max-w-5xl mx-auto px-4 space-y-6"
    >
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {!results && (
          <div
            className={`flex items-center gap-2 bg-white dark:bg-slate-900 border px-4 py-2 rounded-2xl shadow-inner transition-colors ${timerColors.ring}`}
            title={timerTier === 'critical' ? 'Time is almost up — submit now!' : timerTier === 'warn' ? 'Under 2 minutes remaining' : undefined}
          >
            <Timer className={`w-4 h-4 ${timerColors.icon}`} />
            <span className={`font-mono text-sm font-black tracking-widest ${timerColors.text}`}>
              {formatTime(timeLeft)}
            </span>
            <span className="w-16 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ml-1 hidden sm:block">
              <span
                className={`block h-full rounded-full transition-all duration-1000 ${timerColors.bar}`}
                style={{ width: `${timeFrac * 100}%` }}
              />
            </span>
          </div>
        )}
      </div>

      <div className="text-center space-y-2">
        <div className="inline-block bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-1 rounded-full text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-widest mb-1">
          {category} Practice Arena
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Edunexus Adaptive Learning Workbench
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xl mx-auto">
          Reinforce conceptual skills. 10 XP points awarded for every correct solution. Re-attempt to beat your personal best.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center gap-4 bg-slate-100 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900 p-2.5 rounded-2xl max-w-sm mx-auto">
        <button
          onClick={() => setMode('mcq')}
          className={`flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
            mode === 'mcq'
              ? 'bg-emerald-600 text-slate-950 shadow-md'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Adaptive Quiz Mode
        </button>
        <button
          onClick={() => setMode('coding')}
          className={`flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
            mode === 'coding'
              ? 'bg-emerald-600 text-slate-950 shadow-md'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Interactive Coding Mode
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'coding' ? (
          <motion.div
            key="coding-layout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-850 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Practice Coding Templates</h3>
                  <p className="text-[11px] text-slate-500 mt-1">Select a track template and solve the inline debugging exercises.</p>
                </div>
                <div className="flex gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-1 rounded-xl">
                  {(['C', 'C++', 'IoT'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                        selectedLang === lang
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-2xl text-xs space-y-2">
                <span className="text-[11px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest">Exercise Description:</span>
                {selectedLang === 'C' && (
                  <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                    <strong>C bitmasking control register:</strong> You need to set bit 0 and bit 3 of the control register
                    using a bitwise OR operator. Complete the code by making sure <code>SYS_CTRL_REG</code> is correctly modified.
                  </p>
                )}
                {selectedLang === 'C++' && (
                  <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                    <strong>C++ class instance allocation:</strong> Instantiate the <code>TempSensor</code> class with a starting temperature
                    of <code>24.5</code>. Ensure the printed output matches the target specification.
                  </p>
                )}
                {selectedLang === 'IoT' && (
                  <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                    <strong>IoT publisher telemetry event:</strong> Trigger the ESP32 setup configuration, and then print
                    the telemetry publish event matching the required output format.
                  </p>
                )}
              </div>

              <CodePlayground
                key={selectedLang}
                initialCode={codingTemplates[selectedLang].initialCode}
                language={codingTemplates[selectedLang].language}
                expectedOutput={codingTemplates[selectedLang].expectedOutput}
              />
            </div>
          </motion.div>
        ) : !results ? (
          <motion.div
            key="quiz-layout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Left Column: Navigator Panel */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl space-y-6 self-start shadow-xl">
              <div>
                <h3 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Question Navigator</h3>
                <p className="text-[11px] text-slate-500 mt-1">Jump to any question instantly.</p>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isActive = idx === currentIdx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 border border-emerald-400'
                          : isAnswered
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-850 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <div className="w-3 h-3 bg-emerald-500 rounded"></div> Current Question
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <div className="w-3 h-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded"></div> Solved Question
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <div className="w-3 h-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded"></div> Unanswered
                </div>
              </div>
            </div>

            {/* Right Column: Question Card Panel */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-4">
                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider font-mono">
                    Topic: {currentQuestion.topic}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                    currentQuestion.difficulty === 'Easy'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25'
                      : currentQuestion.difficulty === 'Medium'
                      ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/25'
                      : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/25'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                    {currentIdx + 1}. {currentQuestion.text}
                  </h2>

                  <div className="grid gap-3 pt-2">
                    {currentQuestion.options.map((opt, oIdx) => {
                      const isSelected = answers[currentQuestion.id] === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleOptionSelect(currentQuestion.id, opt)}
                          className={`text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-100 shadow-inner'
                              : 'bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 dark:hover:border-slate-800'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>}
                          </div>
                          <span className="text-sm font-medium leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Navigator Actions bar */}
              <div className="flex items-center justify-between gap-2">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((p) => p - 1)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center gap-1 transition ${
                    currentIdx === 0
                      ? 'bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-650 cursor-not-allowed border-slate-200 dark:border-slate-900'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-850'
                  }`}
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <button
                  onClick={() => submitTest(false)}
                  disabled={submitting}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 dark:shadow-emerald-900/30 flex items-center gap-2 hover:-translate-y-0.5 transition-all"
                >
                  Submit Practice Set
                </button>

                <button
                  disabled={currentIdx === questions.length - 1}
                  onClick={() => setCurrentIdx((p) => p + 1)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center gap-1 transition ${
                    currentIdx === questions.length - 1
                      ? 'bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-650 cursor-not-allowed border-slate-200 dark:border-slate-900'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-850'
                  }`}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results-layout"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Header Results Score Card */}
            <div className={`p-8 md:p-12 rounded-3xl border text-center shadow-2xl relative overflow-hidden ${
              results.accuracy >= 60
                ? 'bg-gradient-to-b from-emerald-50 dark:from-emerald-950/80 to-white dark:to-slate-900 border-emerald-200 dark:border-emerald-500/30'
                : 'bg-gradient-to-b from-rose-50 dark:from-rose-950/80 to-white dark:to-slate-900 border-rose-200 dark:border-rose-500/30'
            }`}>
              <div className="absolute top-0 right-0 w-72 h-72 bg-slate-900/5 dark:bg-white/5 rounded-full blur-3xl"></div>

              <div className="space-y-6 relative z-10">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-inner ${
                  results.accuracy >= 60 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}>
                  {results.accuracy >= 60 ? <Award size={40} /> : <Trophy size={40} />}
                </div>

                <div className="space-y-1">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                    {results.accuracy}% Accuracy
                  </h2>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    Correct: <strong className="text-slate-900 dark:text-white">{results.score}</strong> / {results.totalQuestions} Questions
                  </p>
                </div>

                <div className="inline-block bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-6 py-2 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
                  Points Earned: +{results.pointsEarned} XP
                </div>

                <p className="text-slate-500 dark:text-slate-350 text-xs max-w-md mx-auto leading-relaxed">
                  {results.accuracy >= 60
                    ? "Fantastic! You are mastering these core concepts. Keep hitting tests to scale up your leaderboard ranks."
                    : "There is room for improvement. Let's analyze the explanations below and give it another try!"}
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                  <button
                    onClick={handleRetry}
                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white dark:text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-600/20 dark:shadow-emerald-900/20 transition-all hover:-translate-y-0.5"
                  >
                    <RefreshCw size={14} /> Re-run Practice Arena
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Explanatory solutions breakdown */}
            <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="px-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Concept Solutions Breakdown</h3>
                <p className="text-xs text-slate-500 mt-1">Review precise corrections and in-depth hardware/software conceptual explanations.</p>
              </div>

              <div className="space-y-4">
                {results.breakdown.map((item, idx) => (
                  <div
                    key={item.questionId}
                    className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
                      item.isCorrect ? 'bg-emerald-50/60 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30' : 'bg-rose-50/60 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/30'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="pt-0.5 shrink-0">
                        {item.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        )}
                      </div>

                      <div className="space-y-4 w-full">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                            {idx + 1}. {item.text}
                          </h4>
                          <span className="text-[11px] uppercase font-black tracking-widest text-slate-500 font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-2 py-0.5 rounded">
                            Topic: {item.topic}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-1">
                            <span className="text-[11px] font-black uppercase text-slate-500 block">Your Selected Answer</span>
                            <span className={`text-xs font-medium ${item.isCorrect ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400'}`}>
                              {item.userAnswer || 'No Answer Submitted'}
                            </span>
                          </div>

                          {!item.isCorrect && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border border-emerald-200 dark:border-emerald-950/30 rounded-2xl space-y-1">
                              <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 block">Correct Conceptual Answer</span>
                              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.correctAnswer}</span>
                            </div>
                          )}
                        </div>

                        {item.explanation && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">Conceptual Explanation</span>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PracticeArena;
