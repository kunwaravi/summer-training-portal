import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Send, ArrowRight, ArrowLeft, Clock, AlertTriangle, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const Quiz = () => {
  const { courseId, week } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Quiz Timer State: 5 minutes (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);

  // Submission Results State
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [breakdown, setBreakdown] = useState<any[]>([]);

  // Celebrate success when passing the assessment!
  useEffect(() => {
    if (submitted && passed) {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6']
      });
    }
  }, [submitted, passed]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/quiz/questions/${courseId}/${week}`);
        setQuestions(res.data.questions || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load quiz questions.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [courseId, week]);

  // Live Timer Count Down
  useEffect(() => {
    if (submitted || loading || questions.length === 0) return;
    
    if (timeLeft <= 0) {
      handleSubmitQuiz(true); // Auto-submit when time is up
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted, loading, questions]);

  const handleOptionSelect = (option: string) => {
    const activeQuestion = questions[currentQuestionIndex];
    setAnswers({ ...answers, [activeQuestion.id]: option });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  async function handleSubmitQuiz(forceSubmit = false) {
    if (!forceSubmit && Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/quiz/submit', {
        courseId,
        week: parseInt(week as string),
        answers
      });

      setScore(res.data.score);
      setPassed(res.data.passed);
      setBreakdown(res.data.breakdown || []);
      setSubmitted(true);

      // Instantly synchronize user session inside context with new progresses returned from backend
      if (res.data.updatedUser) {
        const token = localStorage.getItem('token') || '';
        login(token, res.data.updatedUser);
      }
    } catch (err: any) {
      console.error(err);
      alert('Error submitting quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading && !submitted) {
    return <div className="text-center py-20 text-slate-400">Loading quiz environment...</div>;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <AlertTriangle className="text-red-500 mx-auto" size={48} />
        <h2 className="text-xl font-bold">Access Blocked</h2>
        <p className="text-slate-400 text-sm">{error}</p>
        <button 
          onClick={() => navigate(`/course/${courseId}`)}
          className="px-6 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-sm transition"
        >
          Back to Course Detail
        </button>
      </div>
    );
  }

  // Quiz Results Grading Overview Screen
  if (submitted) {
    return (
      <div className="py-6 max-w-3xl mx-auto px-4 space-y-8">
        
        {/* Top Header Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 rounded-2xl text-center border relative overflow-hidden bg-slate-900/60 shadow-xl ${
            passed 
              ? 'border-emerald-500/30 shadow-emerald-500/5' 
              : 'border-red-500/30 shadow-red-500/5'
          }`}
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none bg-current"></div>
          
          <div className="inline-flex items-center justify-center p-4 rounded-full mb-4 bg-slate-800">
            {passed ? (
              <CheckCircle className="text-emerald-400" size={48} />
            ) : (
              <XCircle className="text-red-400" size={48} />
            )}
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight">
            {passed ? 'Module Passed! 🎉' : 'Assessment Failed ✖'}
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            {passed 
              ? `Congratulations! You unlocked the next week training modules for ${courseId} course track.` 
              : 'You scored below the passing threshold of 60%. Please review the weekly notes and try again.'}
          </p>

          {/* Large Score Meter */}
          <div className="my-6">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Your Score</span>
            <h1 className={`text-6xl font-black ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
              {score}%
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => navigate(`/course/${courseId}`)}
              className="px-6 py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 rounded-xl font-bold transition text-sm flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Return to Course
            </button>
            {!passed && (
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg transition text-sm"
              >
                Re-Attempt Quiz
              </button>
            )}
          </div>
        </motion.div>

        {/* Detailed Question Review Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight px-1">Questions Review</h3>
          
          <div className="space-y-4">
            {breakdown.map((item, index) => (
              <div 
                key={index}
                className={`p-5 rounded-xl border bg-slate-900/30 ${
                  item.isCorrect ? 'border-emerald-500/10' : 'border-red-500/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.isCorrect ? (
                      <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle size={18} className="text-red-400 shrink-0" />
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="font-semibold text-slate-200 text-sm">
                      {index + 1}. {item.text}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-900">
                        <span className="text-slate-450 block">Your Answer:</span>
                        <span className={`font-bold ${item.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                          {item.userAnswer || '[No Answer Selected]'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-900">
                        <span className="text-slate-450 block">Correct Answer:</span>
                        <span className="font-bold text-emerald-400">
                          {item.correctAnswer}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Form Slide Screen
  const activeQuestion = questions[currentQuestionIndex];
  const selectedOption = answers[activeQuestion.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="py-6 max-w-2xl mx-auto px-4 space-y-6">
      
      {/* Top Header Information Panel */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button 
          onClick={() => navigate(`/course/${courseId}`)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-bold uppercase tracking-wider"
        >
          <ChevronLeft size={16} /> Cancel Exam
        </button>
        
        {/* Exam Timer */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm ${
          timeLeft < 60 
            ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' 
            : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}>
          <Clock size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress tracking line */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden p-[0.5px]">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Active Question Panel */}
      <div className="min-h-[320px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 py-4"
          >
            <p className="font-extrabold text-slate-200 text-lg leading-snug">
              {currentQuestionIndex + 1}. {activeQuestion.text}
            </p>
            
            <div className="space-y-3">
              {activeQuestion.options.map((option: string) => {
                const isSelected = selectedOption === option;
                
                return (
                  <label 
                    key={option} 
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-600/10 border-blue-500 text-white font-bold ring-1 ring-blue-500' 
                        : 'bg-slate-900/40 border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name={`q-${activeQuestion.id}`} 
                      value={option}
                      checked={isSelected}
                      onChange={() => handleOptionSelect(option)}
                      className="w-4 h-4 text-blue-600 border-slate-700 bg-slate-800 focus:ring-blue-500 focus:ring-offset-slate-900 shrink-0"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer controls layout */}
        <div className="flex justify-between items-center border-t border-slate-800 pt-6 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all ${
              currentQuestionIndex === 0
                ? 'border-slate-900 text-slate-700 cursor-not-allowed opacity-30'
                : 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <ArrowLeft size={14} /> Previous
          </button>
          
          {isLastQuestion ? (
            <button 
              onClick={() => handleSubmitQuiz()}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-lg shadow-lg shadow-emerald-500/15 flex items-center gap-2 uppercase tracking-wider transition-all"
            >
              Submit Exam <Send size={14} />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center gap-1.5 transition-all"
            >
              Next <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
