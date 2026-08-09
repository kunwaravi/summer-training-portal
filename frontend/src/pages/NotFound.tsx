import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Home, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Branded 404 (Phase 5) — friendly, dual-theme, with real destinations.
 */
const NotFound = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center py-16 px-4"
    >
      <div className="p-3 bg-indigo-50 dark:bg-blue-600/10 border border-indigo-100 dark:border-blue-500/20 rounded-2xl mb-6">
        <img src="/logo.png" alt="Edunexus Logo" className="h-10 w-auto dark:brightness-0 dark:invert" />
      </div>

      <p className="text-[11px] font-black uppercase tracking-[0.35em] text-indigo-600 dark:text-blue-400 mb-2">
        Page not found
      </p>

      <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
        4<span className="text-indigo-600 dark:text-blue-500">0</span>4
      </h1>

      <div className="mt-6 max-w-md space-y-3">
        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed">
          This chapter seems to have been encrypted and misplaced in the syllabus registry.
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
          The URL you followed doesn't exist, may have moved, or your access isn't mapped yet.
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          to={user ? '/dashboard' : '/'}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
        >
          {user ? <LayoutDashboard size={15} /> : <Home size={15} />}
          {user ? 'Return to Dashboard' : 'Back to Home'}
        </Link>
        {user && (
          <Link
            to="/practice/arena"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-black text-xs uppercase tracking-widest transition-all"
          >
            <Compass size={15} /> Continue Practicing
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default NotFound;
