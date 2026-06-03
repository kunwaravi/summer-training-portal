import React from 'react';
import { motion } from 'framer-motion';

interface QuizQuestionProps {
  question: {
    id: number;
    text: string;
    options: string[];
  };
  selectedOption?: string;
  onSelect: (option: string) => void;
  index: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, selectedOption, onSelect, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 py-4"
    >
      <p className="font-extrabold text-slate-200 text-lg leading-snug">
        {index + 1}. {question.text}
      </p>
      
      <div className="space-y-3">
        {question.options.map((option) => {
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
                name={`q-${question.id}`} 
                value={option}
                checked={isSelected}
                onChange={() => onSelect(option)}
                className="w-4 h-4 text-blue-600 border-slate-700 bg-slate-800 focus:ring-blue-500 focus:ring-offset-slate-900 shrink-0"
              />
              <span className="text-sm">{option}</span>
            </label>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuizQuestion;
