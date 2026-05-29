import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Send } from 'lucide-react';

const Quiz = () => {
  const { courseId, week } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Mock questions for demo
  const questions = [
    { id: 1, text: `What is the primary focus of ${courseId} Week ${week}?`, options: ['Hardware', 'Software', 'Networking', 'Security'] },
    { id: 2, text: 'Which of these is a valid data type?', options: ['int', 'number', 'real', 'bit'] },
    { id: 3, text: 'What does I/O stand for?', options: ['Input/Output', 'In/Out', 'Internal/Outer', 'None'] },
    { id: 4, text: 'How many weeks are in this training?', options: ['2', '4', '6', '8'] },
    { id: 5, text: 'Is this training for electronics students?', options: ['Yes', 'No', 'Maybe', 'Only for CS'] },
  ];

  const handleOptionChange = (qId: number, option: string) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions');
      return;
    }

    // Simple scoring for demo: just check if they answered
    const calculatedScore = 80; // Hardcoded for demo success
    setScore(calculatedScore);
    setSubmitted(true);

    try {
      const res = await api.post('/quiz/submit', {
        userId: user.id,
        week: parseInt(week as string),
        score: calculatedScore
      });
      
      // Update local user state
      const updatedUser = { ...user, weekCompleted: parseInt(week as string) };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Re-login to update context (hacky but works for now)
      login(localStorage.getItem('token') || '', updatedUser);
      
    } catch (err) {
      console.error(err);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-slate-800 p-8 rounded-xl text-center border border-slate-700 shadow-xl">
          <h2 className="text-3xl font-bold mb-4 {score >= 60 ? 'text-green-400' : 'text-red-400'}">
            {score >= 60 ? 'Passed!' : 'Failed!'}
          </h2>
          <p className="text-xl mb-6">Your Score: {score}%</p>
          <button 
            onClick={() => navigate(`/course/${courseId}`)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-bold transition"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 border-b border-slate-700 pb-4">
        {courseId} - Week {week} Quiz
      </h1>

      <div className="space-y-8">
        {questions.map((q) => (
          <div key={q.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <p className="font-semibold mb-4 text-lg">{q.id}. {q.text}</p>
            <div className="space-y-2">
              {q.options.map((option) => (
                <label key={option} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 cursor-pointer transition">
                  <input 
                    type="radio" 
                    name={`q-${q.id}`} 
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={() => handleOptionChange(q.id, option)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleSubmit}
        className="mt-12 w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2"
      >
        <Send size={20} /> Submit Quiz
      </button>
    </div>
  );
};

export default Quiz;
