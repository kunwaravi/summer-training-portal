import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, ExternalLink, GitBranch, FileText, Eye, Share2 } from 'lucide-react';
import Spinner from '../atoms/Spinner';

/**
 * Peer Solution Viewer (issue #75) — freeCodeCamp-style community solutions modal.
 * Shows peers' approved submissions for an assignment/project with NO PII
 * (only name + avatar), plus a privacy opt-out toggle for the viewer's own solution.
 */

interface PeerSolutionsModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  type: 'assignment' | 'project';
  fetchSolutions: () => Promise<any[]>;
  myShareEnabled: boolean;
  onToggleShare: (enabled: boolean) => Promise<void>;
}

const PeerSolutionsModal: React.FC<PeerSolutionsModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  type,
  fetchSolutions,
  myShareEnabled,
  onToggleShare,
}) => {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [shareOn, setShareOn] = useState(myShareEnabled);
  const [togglingShare, setTogglingShare] = useState(false);

  useEffect(() => {
    if (!open) return;
    setShareOn(myShareEnabled);
    setLoading(true);
    setError(null);
    fetchSolutions()
      .then((list) => setSolutions(list || []))
      .catch((err: any) => setError(err.response?.data?.message || 'Could not load peer solutions.'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleToggleShare = async () => {
    setTogglingShare(true);
    try {
      const next = !shareOn;
      await onToggleShare(next);
      setShareOn(next);
    } catch {
      setError('Could not update privacy setting.');
    } finally {
      setTogglingShare(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black no-print"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print"
          >
            <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">{title}</h3>
                    {subtitle && <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{subtitle}</p>}
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {loading && (
                  <div className="flex justify-center py-12">
                    <Spinner size="md" />
                  </div>
                )}

                {!loading && error && (
                  <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-bold text-center">
                    {error}
                  </div>
                )}

                {!loading && !error && solutions.length === 0 && (
                  <div className="p-8 text-center space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
                      <Eye size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-300">No peer solutions yet</p>
                    <p className="text-[11px] text-slate-500 font-bold">Be the first to get yours approved and shared here.</p>
                  </div>
                )}

                {!loading && !error && solutions.map((s) => (
                  <div key={s.id} className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden">
                    {/* Card header */}
                    <button
                      onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                      className="w-full p-4 flex items-center gap-3 text-left hover:bg-slate-900/60 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-black shrink-0 overflow-hidden">
                        {s.user.avatarUrl ? (
                          <img src={s.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          (s.user.name || 'S')[0].toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-white truncate">{s.user.name || 'Anonymous Learner'}</p>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          {type === 'assignment' ? s.fileName : s.title} · {new Date(s.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-[11px] font-black text-purple-400 uppercase tracking-widest shrink-0">View</span>
                    </button>

                    {/* Expanded detail */}
                    {expandedId === s.id && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-800/70 space-y-2.5">
                        {type === 'project' && (
                          <>
                            {s.description && (
                              <p className="text-[11px] text-slate-400 leading-relaxed">{s.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              <a href={s.sourceCodeUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-black uppercase tracking-wider hover:bg-emerald-500/20 transition-colors">
                                <GitBranch size={12} /> Source Code
                              </a>
                              <a href={s.reportUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-black uppercase tracking-wider hover:bg-blue-500/20 transition-colors">
                                <FileText size={12} /> Report
                              </a>
                              {s.githubUrl && (
                                <a href={s.githubUrl} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-black uppercase tracking-wider hover:bg-slate-700 transition-colors">
                                  <ExternalLink size={12} /> Repo
                                </a>
                              )}
                            </div>
                          </>
                        )}
                        {type === 'assignment' && (
                          <a href={s.fileUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-bold hover:bg-purple-500/20 transition-colors w-fit">
                            <FileText size={14} /> Open {s.fileName}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer: privacy opt-out */}
              <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={shareOn}
                    onChange={handleToggleShare}
                    disabled={togglingShare}
                    className="w-4 h-4 accent-purple-500"
                  />
                  <span className="text-[11px] font-bold text-slate-300">
                    Share my solution with peers
                  </span>
                </label>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <Share2 size={11} /> Privacy respected · no email/phone shown
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PeerSolutionsModal;
