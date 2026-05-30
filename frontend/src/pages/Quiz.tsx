import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { ShieldCheck, Target, RefreshCw, Award, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/quiz/questions/${id}`);
        setQuestions(res.data.questions);
      } catch (err: any) {
        console.error('Failed to fetch quiz questions:', err);
        if (err.response?.status === 404) {
           setQuestions([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [id]);

  const handleOptionSelect = (questionId: number, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting your final exam.');
      return;
    }

    if (!window.confirm("Are you ready to submit your final exam?")) return;

    setSubmitting(true);
    try {
      const res = await api.post('/quiz/submit', {
        courseId: id,
        answers
      });
      setResult(res.data);
      
      // Update global user context with new results/progress
      if (res.data.updatedUser) {
          fetchUser();
      }

      if (res.data.passed) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      console.error('Failed to submit quiz:', err);
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
      setAnswers({});
      setResult(null);
      window.scrollTo(0,0);
  }

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Final Exam Infrastructure...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">No Exam Found</h2>
        <p className="text-slate-400 mb-8">Final exam questions for {id} have not been published yet.</p>
        <button 
          onClick={() => navigate(`/course/${id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Return to Course
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-8 max-w-4xl mx-auto px-4 space-y-8"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button 
          onClick={() => navigate(`/course/${id}`)} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Course
        </button>
      </div>

      <div className="text-center space-y-3">
        <div className="inline-block bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">
          Final Assessment
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {id} Final Examination
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Test your deep knowledge. Answer all questions below. You need an accuracy of at least <strong className="text-white">60%</strong> to pass and earn your certificate.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {questions.map((q, index) => (
              <div key={q.id} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-black text-sm shrink-0">
                    {index + 1}
                  </span>
                  <div className="space-y-6 w-full">
                    <h3 className="text-lg font-bold text-white leading-relaxed">{q.text}</h3>
                    <div className="grid gap-3">
                      {q.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionSelect(q.id, opt)}
                          className={`text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                            answers[q.id] === opt 
                              ? 'bg-blue-600/20 border-blue-500/50 text-blue-100 shadow-inner' 
                              : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            answers[q.id] === opt ? 'border-blue-500' : 'border-slate-600'
                          }`}>
                            {answers[q.id] === opt && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                          </div>
                          <span className="text-sm font-medium">{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-8 pb-12 flex justify-end">
              <button
                disabled={submitting || Object.keys(answers).length < questions.length}
                onClick={handleSubmit}
                className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 ${
                  submitting || Object.keys(answers).length < questions.length
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/50 hover:-translate-y-1 active:translate-y-0'
                }`}
              >
                {submitting ? 'Processing...' : 'Submit Examination'} <ShieldCheck size={18} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Results Header Card */}
            <div className={`p-8 md:p-12 rounded-3xl border text-center shadow-2xl relative overflow-hidden ${
              result.passed 
                ? 'bg-gradient-to-b from-emerald-950/80 to-slate-900 border-emerald-500/30' 
                : 'bg-gradient-to-b from-rose-950/80 to-slate-900 border-rose-500/30'
            }`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              
              <div className="space-y-6 relative z-10">
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-inner ${
                  result.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {result.passed ? <Award size={48} /> : <Target size={48} />}
                </div>
                
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                    {result.accuracy}% Accuracy
                  </h2>
                  <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                    result.passed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    Grade: {result.grade}
                  </div>
                </div>

                <p className="text-slate-300 text-sm max-w-xl mx-auto">
                  {result.passed 
                    ? "Congratulations! You have demonstrated profound knowledge of the concepts. Your certification is now unlocked." 
                    : "You did not meet the 60% accuracy threshold required to pass. Review the curriculum and try again."}
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                  {result.passed ? (
                    <button 
                      onClick={() => navigate(`/course/${id}`)}
                      className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/30 transition-all text-xs uppercase tracking-widest"
                    >
                      Continue to Certification
                    </button>
                  ) : (
                    <button 
                      onClick={handleRetry}
                      className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-900/30 transition-all text-xs uppercase tracking-widest flex items-center gap-2"
                    >
                      <RefreshCw size={16} /> Re-attempt Exam
                    </button>
                  )}
                  <button 
                    onClick={() => navigate(`/course/${id}`)}
                    className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all text-xs uppercase tracking-widest"
                  >
                    Review Curriculum
                  </button>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-6 pt-8 border-t border-slate-800">
              <h3 className="text-xl font-bold text-white px-2">Performance Breakdown</h3>
              
              <div className="space-y-4">
                {result.breakdown.map((item: any, idx: number) => (
                  <div key={item.questionId} className={`p-6 rounded-2xl border ${
                    item.isCorrect ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-rose-950/20 border-rose-900/30'
                  }`}>
                    <div className="flex gap-4">
                      <div className="pt-1">
                        {item.isCorrect ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">✓</div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center">✕</div>
                        )}
                      </div>
                      <div className="space-y-3 w-full">
                        <p className="text-sm font-medium text-slate-200">{idx + 1}. {item.text}</p>
                        
                        <div className="grid sm:grid-cols-2 gap-4 mt-2">
                          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Your Answer</span>
                            <span className={`text-sm ${item.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {item.userAnswer}
                            </span>
                          </div>
                          
                          {!item.isCorrect && (
                            <div className="p-3 rounded-xl bg-slate-900/50 border border-emerald-900/30">
                              <span className="text-[10px] uppercase font-bold text-emerald-500 block mb-1">Correct Answer</span>
                              <span className="text-sm text-emerald-400">{item.correctAnswer}</span>
                            </div>
                          )}
                        </div>
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

export default Quiz;