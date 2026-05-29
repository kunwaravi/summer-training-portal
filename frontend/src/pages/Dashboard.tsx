import { useNavigate } from 'react-router-dom';
import { Cpu, Code, Wifi, Box } from 'lucide-react';

const courses = [
  { id: 'C', title: 'C Language', icon: <Code />, color: 'from-blue-500 to-blue-700', desc: 'Master procedural programming for hardware.' },
  { id: 'C++', title: 'C++ Language', icon: <Box />, color: 'from-purple-500 to-purple-700', desc: 'Object Oriented Programming for performance.' },
  { id: 'IoT', title: 'IoT', icon: <Wifi />, color: 'from-green-500 to-green-700', desc: 'Connecting the world with sensors and cloud.' },
  { id: 'Embedded', title: 'Embedded Systems', icon: <Cpu />, color: 'from-orange-500 to-orange-700', desc: 'Microcontrollers and Real-Time Systems.' },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 border-b border-slate-700 pb-4">Choose Your Training Track</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div 
            key={course.id}
            onClick={() => navigate(`/course/${course.id}`)}
            className="group cursor-pointer bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all transform hover:-translate-y-2"
          >
            <div className={`h-32 bg-gradient-to-br ${course.color} flex items-center justify-center`}>
              {React.cloneElement(course.icon as React.ReactElement, { size: 48, className: "text-white" })}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition">{course.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{course.desc}</p>
              <div className="flex items-center text-blue-400 font-semibold text-sm">
                Start Training →
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-slate-800 p-8 rounded-xl border border-slate-700">
        <h2 className="text-2xl font-bold mb-4">Training Guidelines</h2>
        <ul className="list-disc list-inside text-slate-400 space-y-2">
          <li>The training is structured into 4 weeks per course.</li>
          <li>Each week has dedicated study material.</li>
          <li>A quiz is mandatory at the end of each week to unlock the next.</li>
          <li>You need at least 60% in each quiz to pass.</li>
          <li>Complete all 4 weeks to generate your official certificate.</li>
        </ul>
      </div>
    </div>
  );
};

import React from 'react';
export default Dashboard;
