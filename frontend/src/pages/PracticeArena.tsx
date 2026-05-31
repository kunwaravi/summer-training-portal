import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Trophy, Timer, ChevronLeft, ChevronRight, CheckCircle2, XCircle, ArrowLeft, RefreshCw, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

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

const PracticeArena = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
  }, [loading, results, timeLeft, submitting]);

  const handleOptionSelect = (questionId: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleAutoSubmit = () => {
    alert("Time is up! Your practice test is being submitted automatically.");
    submitTest(true);
  };

  const submitTest = async (force = false) => {
    if (!force) {
      const answeredCount = Object.keys(answers).length;
      if (answeredCount < questions.length) {
        const confirmSubmit = window.confirm(
          `You have only answered ${answeredCount} of ${questions.length} questions. Are you sure you want to submit?`
        );
        if (!confirmSubmit) return;
      } else {
        const confirmSubmit = window.confirm("Are you ready to submit your practice test?");
        if (!confirmSubmit) return;
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
  };

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

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Assembling Arena Infrastructure...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto space-y-6">
        <h2 className="text-2xl font-black text-white">No Questions Available</h2>
        <p className="text-slate-400 text-sm">Practice questions for the {category} category are not currently seeded.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-6 rounded-xl transition"
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
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {!results && (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 px-4 py-2 rounded-2xl shadow-inner">
            <Timer className={`w-4 h-4 ${timeLeft < 120 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`} />
            <span className={`font-mono text-sm font-black tracking-widest ${timeLeft < 120 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      <div className="text-center space-y-2">
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 px-4 py-1 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">
          {category} Practice Arena
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Edunexus Adaptive Learning Workbench
        </h1>
        <p className="text-slate-400 text-xs max-w-xl mx-auto">
          Reinforce conceptual skills. 10 XP points awarded for every correct solution. Re-attempt to beat your personal best.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!results ? (
          <motion.div
            key="quiz-layout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Left Column: Navigator Panel */}
            <div className="lg:col-span-1 bg-slate-900/60 border border-slate-850 p-6 rounded-3xl space-y-6 self-start shadow-xl">
              <div>
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Question Navigator</h3>
                <p className="text-[10px] text-slate-500 mt-1">Jump to any question instantly.</p>
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
                          ? 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-400'
                          : 'bg-slate-950 border border-slate-850 text-slate-450 hover:bg-slate-800'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-850 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <div className="w-3 h-3 bg-emerald-500 rounded"></div> Current Question
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <div className="w-3 h-3 bg-emerald-950/40 border border-emerald-800/40 rounded"></div> Solved Question
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <div className="w-3 h-3 bg-slate-950 border border-slate-850 rounded"></div> Unanswered
                </div>
              </div>
            </div>

            {/* Right Column: Question Card Panel */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-850 pb-4">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">
                    Topic: {currentQuestion.topic}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    currentQuestion.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                      : currentQuestion.difficulty === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed">
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
                              ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-100 shadow-inner'
                              : 'bg-slate-950/50 border-slate-850 text-slate-300 hover:bg-slate-850 hover:border-slate-800'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-emerald-500' : 'border-slate-600'
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
              <div className="flex items-center justify-between">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((p) => p - 1)}
                  className={`px-4 py-2.5 rounded-xl border border-slate-850 text-xs font-black uppercase tracking-wider flex items-center gap-1 transition ${
                    currentIdx === 0
                      ? 'bg-slate-900/40 text-slate-650 cursor-not-allowed border-slate-900'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <button
                  onClick={() => submitTest(false)}
                  disabled={submitting}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/30 flex items-center gap-2 hover:-translate-y-0.5 transition-all"
                >
                  Submit Practice Set
                </button>

                <button
                  disabled={currentIdx === questions.length - 1}
                  onClick={() => setCurrentIdx((p) => p + 1)}
                  className={`px-4 py-2.5 rounded-xl border border-slate-850 text-xs font-black uppercase tracking-wider flex items-center gap-1 transition ${
                    currentIdx === questions.length - 1
                      ? 'bg-slate-900/40 text-slate-650 cursor-not-allowed border-slate-900'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
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
                ? 'bg-gradient-to-b from-emerald-950/80 to-slate-900 border-emerald-500/30'
                : 'bg-gradient-to-b from-rose-950/80 to-slate-900 border-rose-500/30'
            }`}>
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>

              <div className="space-y-6 relative z-10">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-inner ${
                  results.accuracy >= 60 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {results.accuracy >= 60 ? <Award size={40} /> : <Trophy size={40} />}
                </div>

                <div className="space-y-1">
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-mono">
                    {results.accuracy}% Accuracy
                  </h2>
                  <p className="text-sm font-bold text-slate-400">
                    Correct: <strong className="text-white">{results.score}</strong> / {results.totalQuestions} Questions
                  </p>
                </div>

                <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-2xl text-emerald-400 text-xs font-black uppercase tracking-widest">
                  Points Earned: +{results.pointsEarned} XP
                </div>

                <p className="text-slate-350 text-xs max-w-md mx-auto leading-relaxed">
                  {results.accuracy >= 60
                    ? "Fantastic! You are mastering these core concepts. Keep hitting tests to scale up your leaderboard ranks."
                    : "There is room for improvement. Let's analyze the explanations below and give it another try!"}
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                  <button
                    onClick={handleRetry}
                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5"
                  >
                    <RefreshCw size={14} /> Re-run Practice Arena
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3.5 bg-slate-800 hover:bg-slate-750 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Explanatory solutions breakdown */}
            <div className="space-y-6 pt-6 border-t border-slate-800">
              <div className="px-2">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Concept Solutions Breakdown</h3>
                <p className="text-xs text-slate-500 mt-1">Review precise corrections and in-depth hardware/software conceptual explanations.</p>
              </div>

              <div className="space-y-4">
                {results.breakdown.map((item, idx) => (
                  <div
                    key={item.questionId}
                    className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
                      item.isCorrect ? 'bg-emerald-950/10 border-emerald-900/30' : 'bg-rose-950/10 border-rose-900/30'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="pt-0.5 shrink-0">
                        {item.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400" />
                        )}
                      </div>

                      <div className="space-y-4 w-full">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h4 className="text-sm font-bold text-slate-200 leading-relaxed">
                            {idx + 1}. {item.text}
                          </h4>
                          <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 font-mono bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                            Topic: {item.topic}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl space-y-1">
                            <span className="text-[9px] font-black uppercase text-slate-500 block">Your Selected Answer</span>
                            <span className={`text-xs font-medium ${item.isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400'}`}>
                              {item.userAnswer || 'No Answer Submitted'}
                            </span>
                          </div>

                          {!item.isCorrect && (
                            <div className="p-4 bg-slate-950/50 border border-emerald-950/30 rounded-2xl space-y-1">
                              <span className="text-[9px] font-black uppercase text-emerald-400 block">Correct Conceptual Answer</span>
                              <span className="text-xs font-bold text-emerald-400">{item.correctAnswer}</span>
                            </div>
                          )}
                        </div>

                        {item.explanation && (
                          <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 block">Conceptual Explanation</span>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.explanation}</p>
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
