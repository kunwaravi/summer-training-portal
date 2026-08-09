import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useQuiz } from '../hooks/useQuiz';
import { Send, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import QuizHeader from '../components/organisms/QuizHeader';
import QuizQuestion from '../components/molecules/QuizQuestion';
import ExamResultsModal from '../components/molecules/ExamResultsModal';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';

const Quiz = () => {
  const { courseId, week, topicId } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { addToast } = useUI();
  
  const { data: quizData, loading: fetchingQuiz, error: fetchError, submitQuiz } = useQuiz(courseId, week, topicId);
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Quiz Timer State: 5 minutes (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);

  // Submission Results State
  const [results, setResults] = useState<any>(null);

  // Celebrate success when passing the assessment!
  useEffect(() => {
    if (results?.passed) {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6']
      });
    }
  }, [results]);

  // Live Timer Count Down
  useEffect(() => {
    if (results || fetchingQuiz || !quizData?.questions?.length) return;
    
    if (timeLeft <= 0) {
      handleSubmitQuiz(true); // Auto-submit when time is up
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, results, fetchingQuiz, quizData]);

  const handleOptionSelect = (option: string) => {
    const questions = quizData?.questions || [];
    const activeQuestion = questions[currentQuestionIndex];
    setAnswers({ ...answers, [activeQuestion.id]: option });
  };

  const handleNext = () => {
    const questions = quizData?.questions || [];
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
    const questions = quizData?.questions || [];
    if (!forceSubmit && Object.keys(answers).length < questions.length) {
      addToast('Please answer all questions before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!user) throw new Error('User not authenticated');
      
      const res = await submitQuiz(user.id, answers);
      setResults(res);

      // Instantly synchronize user session inside context with new progresses returned from backend
      if (res.updatedUser) {
        const token = localStorage.getItem('token') || '';
        login(token, res.updatedUser);
      }
      addToast('Quiz submitted successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Error submitting quiz. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (fetchingQuiz && !results) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Spinner size="lg" />
        <p className="text-slate-400 font-medium">Loading quiz environment...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <AlertTriangle className="text-red-500 mx-auto" size={48} />
        <h2 className="text-xl font-bold text-white">Access Blocked</h2>
        <p className="text-slate-400 text-sm">{fetchError}</p>
        <Button 
          variant="outline"
          onClick={() => navigate(`/course/${courseId}`)}
        >
          Back to Course Detail
        </Button>
      </div>
    );
  }

  // Active Quiz Form Slide Screen
  const questions = quizData?.questions || [];
  const activeQuestion = questions[currentQuestionIndex];
  const selectedOption = activeQuestion ? answers[activeQuestion.id] : undefined;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Course completion state for certificate eligibility (issue #76)
  const courseProgress = results?.updatedUser?.progresses?.find((p: any) => p.courseId === courseId);
  const courseCompleted = courseProgress?.completed || courseProgress?.progress === 100;

  if (!activeQuestion) return null;

  return (
    <div className="py-6 max-w-2xl mx-auto px-4 space-y-6">
      
      <QuizHeader 
        onCancel={() => navigate(`/course/${courseId}`)}
        timeLeft={timeLeft}
        formatTime={formatTime}
      />

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
          <QuizQuestion 
            key={currentQuestionIndex}
            index={currentQuestionIndex}
            question={activeQuestion}
            selectedOption={selectedOption}
            onSelect={handleOptionSelect}
          />
        </AnimatePresence>

        {/* Footer controls layout */}
        <div className="flex justify-between items-center border-t border-slate-800 pt-6 mt-6">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            leftIcon={<ArrowLeft size={14} />}
          >
            Previous
          </Button>
          
          {isLastQuestion ? (
            <Button 
              variant="accent"
              isLoading={isSubmitting}
              onClick={() => handleSubmitQuiz()}
              rightIcon={<Send size={14} />}
              className="uppercase tracking-wider"
            >
              Submit Exam
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleNext}
              rightIcon={<ArrowRight size={14} />}
            >
              Next
            </Button>
          )}
        </div>
      </div>

      {/* Exam Results Modal (issue #76) */}
      <ExamResultsModal
        open={!!results}
        onClose={() => navigate(`/course/${courseId}`)}
        passed={results?.passed}
        score={results?.score || 0}
        courseId={courseId || ''}
        breakdown={results?.breakdown || []}
        courseCompleted={courseCompleted}
        onRetry={() => window.location.reload()}
        onViewCertificate={() => navigate(`/certificate?courseId=${courseId}`)}
        onReturn={() => navigate(`/course/${courseId}`)}
      />
    </div>
  );
};

export default Quiz;
