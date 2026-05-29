import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Lock, BookOpen, Play } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const [weeks, setWeeks] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/courses');
        setWeeks(res.data[id as string] || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContent();
  }, [id]);

  const currentWeek = user?.weekCompleted || 0;

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard')} className="text-blue-400 hover:underline">← Back</button>
        <h1 className="text-3xl font-bold">{id} Training Curriculum</h1>
      </div>

      <div className="space-y-6">
        {weeks.map((week, index) => {
          const isUnlocked = index <= currentWeek;
          const isCompleted = index < currentWeek;
          
          return (
            <div 
              key={index}
              className={`p-6 rounded-xl border ${isUnlocked ? 'bg-slate-800 border-slate-700' : 'bg-slate-900 border-slate-800 opacity-60'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-blue-900 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>
                    {isUnlocked ? <BookOpen size={20} /> : <Lock size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Week {week.week}: {week.title}</h3>
                    <p className="text-sm text-slate-400">Status: {isCompleted ? 'Completed' : isUnlocked ? 'In Progress' : 'Locked'}</p>
                  </div>
                </div>
                {isCompleted ? (
                  <CheckCircle className="text-green-500" />
                ) : isUnlocked ? (
                  <button 
                    onClick={() => navigate(`/quiz/${id}/${week.week}`)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition flex items-center gap-2"
                  >
                    <Play size={16} /> Start Quiz
                  </button>
                ) : null}
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <p className="text-slate-300">{week.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {currentWeek >= 4 && (
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-2xl border border-blue-500/50">
          <h2 className="text-2xl font-bold mb-4">Congratulations! 🎉</h2>
          <p className="mb-6 text-slate-300">You have completed all 4 weeks of {id} training. You can now download your official certificate.</p>
          <button 
            onClick={() => navigate('/certificate')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-3 rounded-xl font-bold text-lg transition shadow-lg"
          >
            Generate Certificate
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
