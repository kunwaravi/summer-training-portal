import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, HelpCircle } from 'lucide-react';

const FloatingSupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] no-print">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 mb-4 items-end"
          >
            {/* WhatsApp Support Button */}
            <motion.a
              href="https://chat.whatsapp.com/Ba4J77LOmzVBrlHjQtm6Ar?s=cl&p=a&mlu=1"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-4 py-3 bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-[0_4px_15px_rgba(37,211,102,0.4)] transition-colors duration-200 group"
            >
              <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-300 ease-out whitespace-nowrap">
                WhatsApp Group
              </span>
              <MessageCircle size={18} className="shrink-0" />
            </motion.a>

            {/* Telegram Support Button */}
            <motion.a
              href="https://t.me/+tCapxtLwxNNlZjY1"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-4 py-3 bg-[#229ED9] hover:bg-[#1f8ec3] text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-[0_4px_15px_rgba(34,158,217,0.4)] transition-colors duration-200 group"
            >
              <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-300 ease-out whitespace-nowrap">
                Telegram Group
              </span>
              <Send size={18} className="shrink-0" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle floating action button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
          isOpen 
            ? 'bg-slate-900 border border-slate-800 hover:bg-slate-800' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/30'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="help-icon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative flex items-center justify-center"
            >
              <HelpCircle size={24} />
              {/* Notification ping badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingSupportWidget;
