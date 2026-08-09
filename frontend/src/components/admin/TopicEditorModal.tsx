import React from 'react';
import { Edit3, Eye, Image, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Topic {
  id?: number;
  title: string;
  text: string;
  code?: string;
  note?: string;
  order: number;
}

interface TopicEditorModalProps {
  editingTopic: Topic;
  isNewTopic: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (topic: Topic) => void;
  showLivePreview: boolean;
  onTogglePreview: () => void;
  mockAssetUrl: string;
  onChangeMockAssetUrl: (url: string) => void;
  uploadingAsset: boolean;
  onMockAssetUpload: () => void;
}

export const TopicEditorModal: React.FC<TopicEditorModalProps> = ({
  editingTopic,
  isNewTopic,
  onClose,
  onSave,
  onChange,
  showLivePreview,
  onTogglePreview,
  mockAssetUrl,
  onChangeMockAssetUrl,
  uploadingAsset,
  onMockAssetUpload
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-cyan-400">
            <Edit3 size={18} />
            <h3 className="text-sm font-black uppercase tracking-wider">
              {isNewTopic ? 'Create Dynamic Topic Block' : 'Modify Topic Block'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePreview}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition flex items-center gap-1.5 ${
                showLivePreview 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                  : 'bg-slate-800 border border-slate-700 text-slate-400'
              }`}
            >
              <Eye size={12} /> {showLivePreview ? 'Hide Live Preview' : 'Show Live Preview'}
            </button>
            <button 
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-white px-2 py-1"
            >
              Cancel ✕
            </button>
          </div>
        </div>

        {/* WYSIWYG Workspace: Left (Editor), Right (Live Visual Blueprint Preview) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Editor Form Panel */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto space-y-4 border-r border-slate-850 text-left">
            
            {/* Topic Title */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-slate-400">Topic Title</label>
              <input 
                type="text"
                required
                placeholder="e.g. Memory Layout & Static Variables"
                value={editingTopic.title}
                onChange={(e) => onChange({ ...editingTopic, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Topic Main Content text */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-slate-400">Topic Content Body (Rich Text Support)</label>
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-white react-quill-dark-theme">
                <ReactQuill 
                  theme="snow"
                  value={editingTopic.text}
                  onChange={(content) => onChange({ ...editingTopic, text: content })}
                  className="text-xs focus:outline-none"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{'list': 'ordered'}, {'list': 'bullet'}],
                      ['link', 'image', 'code-block'],
                      ['clean']
                    ]
                  }}
                />
              </div>
            </div>

            {/* Inline Code Snippet */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-slate-400">Compiler Code Snippet (Optional)</label>
              <textarea 
                rows={4}
                placeholder="#include <stdio.h>\n..."
                value={editingTopic.code || ''}
                onChange={(e) => onChange({ ...editingTopic, code: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-cyan-400 placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition font-mono"
              />
            </div>

            {/* Takeaway / note */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-slate-400">Highlight Takeaway / Core Note (Optional)</label>
              <input 
                type="text"
                placeholder="Highlight standard errors, caveats, or dynamic memory leaks..."
                value={editingTopic.note || ''}
                onChange={(e) => onChange({ ...editingTopic, note: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Asset Diagram Mock Upload Helper (Issue #8) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3.5 mt-2">
              <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-black uppercase">
                <Image size={14} className="text-cyan-400" /> Embedded Infographic Upload Sandbox
              </div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Insert diagram URL (e.g. /blueprints/stages.svg)"
                  value={mockAssetUrl}
                  onChange={(e) => onChangeMockAssetUrl(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition"
                />
                <button 
                  type="button"
                  disabled={uploadingAsset || !mockAssetUrl}
                  onClick={onMockAssetUpload}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-cyan-400 hover:text-white rounded-lg text-[11px] font-bold uppercase transition"
                >
                  {uploadingAsset ? 'Mounting...' : 'Mount Asset'}
                </button>
              </div>
            </div>

          </div>

          {/* WYSIWYG Side-by-Side Premium Live Preview Pane */}
          {showLivePreview && (
            <div className="hidden md:block w-1/2 p-6 bg-slate-950/40 overflow-y-auto space-y-4 text-left">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
                <Eye size={14} className="text-cyan-400" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-450">
                  Student Learning Pane Real-Time Preview
                </span>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="text-lg font-black text-white">{editingTopic.title || 'Untitled Topic'}</h4>
                <div 
                  className="text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: editingTopic.text || 'Study material description placeholder.' }}
                />
                
                {editingTopic.code && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-cyan-400 overflow-x-auto shadow-inner leading-relaxed select-none">
                    <pre><code>{editingTopic.code}</code></pre>
                  </div>
                )}

                {editingTopic.note && (
                  <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-300 text-xs leading-relaxed flex items-start gap-3">
                    <span className="text-lg select-none">💡</span>
                    <div>
                      <strong className="text-teal-200 block mb-0.5">Core Takeaway</strong>
                      {editingTopic.note}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition"
          >
            Cancel
          </button>
          <button 
            onClick={onSave}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-cyan-500/10 flex items-center gap-1.5 active:scale-[0.98]"
          >
            <Save size={14} /> Save Topic Block
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default TopicEditorModal;
