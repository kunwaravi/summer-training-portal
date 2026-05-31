import { useState, useEffect } from 'react';
import api from '../api';
import { 
  Shield, BookOpen, Edit3, Trash2, Plus, 
  ArrowUp, ArrowDown, DollarSign, RefreshCw, ChevronDown, ChevronRight,
  FileText, Award, Users, BarChart3, Search, UserCheck, UserMinus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentAuditTable } from '../components/admin/PaymentAuditTable';
import { TopicEditorModal } from '../components/admin/TopicEditorModal';
import { useAuth } from '../context/AuthContext';

interface Topic {
  id?: number;
  title: string;
  text: string;
  code?: string;
  note?: string;
  order: number;
}

interface QuizQuestion {
  id?: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface Module {
  id: number;
  week: number;
  title: string;
  description: string;
  topics?: Topic[];
  quizQuestions?: QuizQuestion[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules?: Module[];
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'cms' | 'users' | 'metrics'>('transactions');
  
  // User Registry states
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  
  // Transaction logs states (PAGINATED)
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // CMS courses states
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCms, setLoadingCms] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
  
  // Active editing state
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [topicModuleId, setTopicModuleId] = useState<number | null>(null);
  const [isNewTopic, setIsNewTopic] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Quiz editing state
  const [editingQuiz, setEditingQuiz] = useState<QuizQuestion | null>(null);
  const [quizModuleId, setQuizModuleId] = useState<number | null>(null);
  const [isNewQuiz, setIsNewQuiz] = useState(false);

  // Asset mock upload state
  const [mockAssetUrl, setMockAssetUrl] = useState('');
  const [uploadingAsset, setUploadingAsset] = useState(false);

  // Fetch initial payment transactions for audit dashboard
  const fetchTransactions = async (page = 1) => {
    setLoadingTransactions(true);
    try {
      const res = await api.get(`/payments/admin/all?page=${page}&limit=10`);
      setTransactions(res.data.payments);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.total);
      setCurrentPage(res.data.page);
    } catch (err) {
      console.error('Failed to fetch payment list:', err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Fetch syllabus courses and dynamic module data
  const fetchCmsCourses = async () => {
    setLoadingCms(true);
    try {
      const res = await api.get('/courses');
      // Format backend schema structure
      const formatted: Course[] = Object.keys(res.data).map(key => ({
        id: key,
        title: key === 'C' ? 'C & Systems Programming' : key === 'C++' ? 'C++ & OOP' : key === 'IoT' ? 'IoT Interfacing' : 'Embedded Systems',
        description: 'Relational database course',
        modules: res.data[key]
      }));
      setCourses(formatted);
      if (formatted.length > 0) {
        setSelectedCourse(formatted[0]);
      }
    } catch (err) {
      console.error('Failed to load courses for CMS:', err);
    } finally {
      setLoadingCms(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/auth/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleUserRole = async (userId: number, currentRole: string) => {
    const nextRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) return;
    try {
      await api.put(`/auth/admin/user/${userId}/role`, { role: nextRole });
      fetchUsers();
      alert('User role updated successfully!');
    } catch (err) {
      console.error('Failed to update user role:', err);
      alert('Failed to update role.');
    }
  };

  const handleToggleUserVerification = async (userId: number, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    try {
      await api.put(`/auth/admin/user/${userId}/verify`, { isVerified: nextStatus });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user verification:', err);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete this user account? All course progress, forum posts, and quiz results will be purged.')) return;
    try {
      await api.delete(`/auth/admin/user/${userId}`);
      fetchUsers();
      alert('User deleted.');
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
      fetchCmsCourses();
      fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Fetch all topics and quiz questions for a module once expanded
  const handleToggleExpandModule = async (moduleId: number, courseId: string, week: number) => {
    if (expandedModuleId === moduleId) {
      setExpandedModuleId(null);
      return;
    }

    try {
      const res = await api.get(`/courses/${courseId}/module/${week}`);
      const detailedModule = res.data;
      
      // Update local state with rich details
      if (selectedCourse) {
        const updatedModules = selectedCourse.modules?.map(m => 
          m.id === moduleId ? { ...m, topics: detailedModule.topics } : m
        );
        setSelectedCourse({ ...selectedCourse, modules: updatedModules });
      }
      
      // Also fetch quiz questions from REST API
      const quizRes = await api.get(`/quiz/questions/${courseId}/${week}`);
      if (selectedCourse) {
        const updatedModules = selectedCourse.modules?.map(m => 
          m.id === moduleId ? { ...m, topics: m.topics, quizQuestions: quizRes.data.questions } : m
        );
        setSelectedCourse({ ...selectedCourse, modules: updatedModules });
      }

      setExpandedModuleId(moduleId);
    } catch (err) {
      console.error('Failed to load module details:', err);
      // Fallback local simulation if database tables are in process of seeding
      setExpandedModuleId(moduleId);
    }
  };

  // Topic actions (CRUD & Sorting)
  const handleOpenEditTopic = (topic: Topic, moduleId: number) => {
    setEditingTopic({ ...topic });
    setTopicModuleId(moduleId);
    setIsNewTopic(false);
  };

  const handleOpenAddTopic = (moduleId: number) => {
    const nextOrder = selectedCourse?.modules?.find(m => m.id === moduleId)?.topics?.length || 0;
    setEditingTopic({
      title: '',
      text: '',
      code: '',
      note: '',
      order: nextOrder
    });
    setTopicModuleId(moduleId);
    setIsNewTopic(true);
  };

  const handleSaveTopic = async () => {
    if (!editingTopic || topicModuleId === null || !selectedCourse) return;

    try {
      if (isNewTopic) {
        await api.post(`/courses/module/${topicModuleId}/topic`, editingTopic);
      } else {
        await api.put(`/courses/topic/${editingTopic.id}`, editingTopic);
      }

      // Refresh curriculum details
      const activeModule = selectedCourse.modules?.find(m => m.id === topicModuleId);
      if (activeModule) {
        await handleToggleExpandModule(topicModuleId, selectedCourse.id, activeModule.week);
        // Toggle open back again
        setExpandedModuleId(topicModuleId);
      }

      setEditingTopic(null);
      alert('Topic saved successfully!');
    } catch (err) {
      console.error('Failed to save topic:', err);
      alert('Failed to save topic.');
    }
  };

  const handleDeleteTopic = async (topicId: number, moduleId: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this topic?')) return;
    try {
      await api.delete(`/courses/topic/${topicId}`);
      if (selectedCourse) {
        const activeModule = selectedCourse.modules?.find(m => m.id === moduleId);
        if (activeModule) {
          await handleToggleExpandModule(moduleId, selectedCourse.id, activeModule.week);
          setExpandedModuleId(moduleId);
        }
      }
      alert('Topic deleted successfully.');
    } catch (err) {
      console.error('Failed to delete topic:', err);
    }
  };

  // Drag-and-Drop / Shifting topic orders dynamically (Issue #8)
  const handleShiftTopicOrder = async (topicIndex: number, direction: 'up' | 'down', moduleId: number) => {
    if (!selectedCourse) return;
    const activeModule = selectedCourse.modules?.find(m => m.id === moduleId);
    if (!activeModule || !activeModule.topics) return;

    const topicsList = [...activeModule.topics];
    const targetIndex = direction === 'up' ? topicIndex - 1 : topicIndex + 1;

    if (targetIndex < 0 || targetIndex >= topicsList.length) return;

    // Swap ordering numbers
    const tempOrder = topicsList[topicIndex].order;
    topicsList[topicIndex].order = topicsList[targetIndex].order;
    topicsList[targetIndex].order = tempOrder;

    // Update in database using API calls
    try {
      await api.put(`/courses/topic/${topicsList[topicIndex].id}`, { order: topicsList[topicIndex].order });
      await api.put(`/courses/topic/${topicsList[targetIndex].id}`, { order: topicsList[targetIndex].order });
      
      await handleToggleExpandModule(moduleId, selectedCourse.id, activeModule.week);
      setExpandedModuleId(moduleId);
    } catch (err) {
      console.error('Failed to shift topic ordering:', err);
    }
  };

  // Quiz Question actions
  const handleOpenAddQuiz = (moduleId: number) => {
    setEditingQuiz({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
    setQuizModuleId(moduleId);
    setIsNewQuiz(true);
  };

  const handleOpenEditQuiz = (quiz: QuizQuestion, moduleId: number) => {
    setEditingQuiz({ ...quiz });
    setQuizModuleId(moduleId);
    setIsNewQuiz(false);
  };

  const handleSaveQuiz = async () => {
    if (!editingQuiz || quizModuleId === null || !selectedCourse) return;

    try {
      if (isNewQuiz) {
        await api.post(`/quiz/module/${quizModuleId}/question`, editingQuiz);
      } else {
        await api.put(`/quiz/question/${editingQuiz.id}`, editingQuiz);
      }

      // Refresh curriculum details
      const activeModule = selectedCourse.modules?.find(m => m.id === quizModuleId);
      if (activeModule) {
        await handleToggleExpandModule(quizModuleId, selectedCourse.id, activeModule.week);
        setExpandedModuleId(quizModuleId);
      }

      setEditingQuiz(null);
      alert('Quiz question saved successfully!');
    } catch (err) {
      console.error('Failed to save quiz question:', err);
      alert('Failed to save quiz question.');
    }
  };

  const handleDeleteQuiz = async (quizId: number, moduleId: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this quiz question?')) return;
    try {
      await api.delete(`/quiz/question/${quizId}`);
      if (selectedCourse) {
        const activeModule = selectedCourse.modules?.find(m => m.id === moduleId);
        if (activeModule) {
          await handleToggleExpandModule(moduleId, selectedCourse.id, activeModule.week);
          setExpandedModuleId(moduleId);
        }
      }
      alert('Quiz question deleted successfully.');
    } catch (err) {
      console.error('Failed to delete quiz question:', err);
    }
  };

  // Interactive sandbox mock upload helper
  const handleMockAssetUpload = () => {
    if (!mockAssetUrl) return;
    setUploadingAsset(true);
    setTimeout(() => {
      setUploadingAsset(false);
      // Append loaded asset URL directly into the editor body!
      if (editingTopic) {
        setEditingTopic({
          ...editingTopic,
          text: editingTopic.text + `\n\n![Accredited Infrastructure Diagram](${mockAssetUrl})`
        });
      }
      setMockAssetUrl('');
      alert('Mock Diagram asset successfully mounted in WYSIWYG editor!');
    }, 1000);
  };

  const { user } = useAuth();

  const filteredUsers = users.filter((u) => {
    const query = userSearch.toLowerCase();
    const nameMatch = u.name ? u.name.toLowerCase().includes(query) : false;
    const emailMatch = u.email ? u.email.toLowerCase().includes(query) : false;
    const collegeMatch = u.collegeName ? u.collegeName.toLowerCase().includes(query) : false;
    return nameMatch || emailMatch || collegeMatch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 px-2">
      
      {/* Admin Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Staff Portal & Course CMS
            </h1>
            <p className="text-slate-400 text-xs font-semibold">Nexus Corporate Academic Accreditations & Content Editors</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { fetchTransactions(); fetchCmsCourses(); }}
            className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
            title="Reload Data"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-5 py-3 text-sm font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
            activeTab === 'transactions'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign size={16} /> Payment Audits
        </button>
        <button
          onClick={() => setActiveTab('cms')}
          className={`px-5 py-3 text-sm font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
            activeTab === 'cms'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen size={16} /> Course Syllabus CMS
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3 text-sm font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users size={16} /> Student Accounts
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-5 py-3 text-sm font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
            activeTab === 'metrics'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 size={16} /> Platform Metrics
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        
        {activeTab === 'transactions' && (
          <PaymentAuditTable
            payments={transactions}
            loading={loadingTransactions}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={(page) => fetchTransactions(page)}
          />
        )}

        {activeTab === 'cms' && (
          /* Advanced Interactive CMS Syllabus Builder (Issue #8) */
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Sidebar Tracks */}
            <div className="w-full lg:w-1/4 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-3 shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-wider px-2 pb-2 border-b border-slate-800 text-slate-350">
                Learning Tracks
              </h3>
              <div className="space-y-2">
                {courses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCourse(c); setExpandedModuleId(null); }}
                    className={`w-full text-left px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${
                      selectedCourse?.id === c.id
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-white font-extrabold shadow shadow-cyan-500/5'
                        : 'bg-slate-850/20 border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs uppercase font-black tracking-wider">{c.id} curriculum</span>
                    <ChevronRight size={14} className="text-slate-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Syllabus Editor Console */}
            <div className="flex-1 bg-slate-900/20 border border-slate-800 rounded-2xl p-6 space-y-6">
              {loadingCms ? (
                <div className="py-12 text-center text-slate-500 font-semibold text-sm">Loading CMS builder modules...</div>
              ) : selectedCourse ? (
                <div className="space-y-6">
                  
                  {/* Course Title Header */}
                  <div className="pb-4 border-b border-slate-800/80 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {selectedCourse.id} Curriculum Console
                      </span>
                      <h2 className="text-lg font-black text-white mt-1.5">Syllabus Weeks & Modules</h2>
                    </div>
                  </div>

                  {/* Modules Accordions */}
                  <div className="space-y-4">
                    {selectedCourse.modules?.map((m) => {
                      const isExpanded = expandedModuleId === m.id;
                      return (
                        <div key={m.id} className="border border-slate-850 rounded-xl bg-slate-950/20 overflow-hidden">
                          
                          {/* Module Header Bar */}
                          <div 
                            onClick={() => handleToggleExpandModule(m.id, selectedCourse.id, m.week)}
                            className="p-4 bg-slate-900/40 hover:bg-slate-900/80 flex items-center justify-between cursor-pointer transition select-none"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-black text-slate-300">
                                W{m.week}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-200">{m.title}</h4>
                                <p className="text-[10px] text-slate-500 truncate max-w-[320px]">{m.description}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                              <button 
                                onClick={() => handleOpenAddTopic(m.id)}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1"
                              >
                                <Plus size={12} /> Add Topic
                              </button>
                              <button 
                                onClick={() => handleOpenAddQuiz(m.id)}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 hover:text-white rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1"
                              >
                                <Plus size={12} /> Add Quiz Q
                              </button>
                              {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                            </div>
                          </div>

                          {/* Expanded Content View */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-slate-900 bg-slate-950/40 p-4 space-y-6"
                              >
                                
                                {/* Topics Section */}
                                <div className="space-y-3">
                                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                    <FileText size={12} /> Topic Curriculum Blocks
                                  </h5>

                                  {(!m.topics || m.topics.length === 0) ? (
                                    <div className="text-[10px] text-slate-600 pl-4 py-2 font-semibold">No topics defined for this week. Click 'Add Topic' above.</div>
                                  ) : (
                                    <div className="space-y-2">
                                      {m.topics.map((t, idx) => (
                                        <div key={t.id} className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex items-center justify-between group/row">
                                          <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-slate-600">#{idx + 1}</span>
                                            <div>
                                              <span className="text-xs font-bold text-slate-200">{t.title}</span>
                                              {t.code && <span className="ml-2 text-[8px] bg-cyan-500/10 border border-cyan-500/25 px-1.5 py-0.5 rounded text-cyan-400 font-mono">Code</span>}
                                            </div>
                                          </div>
                                          
                                          {/* CMS Shifting and CRUD buttons (Issue #8) */}
                                          <div className="flex items-center gap-2">
                                            <button 
                                              disabled={idx === 0}
                                              onClick={() => handleShiftTopicOrder(idx, 'up', m.id)}
                                              className="p-1 text-slate-500 hover:text-cyan-400 disabled:opacity-20 transition"
                                            >
                                              <ArrowUp size={14} />
                                            </button>
                                            <button 
                                              disabled={idx === (m.topics?.length || 1) - 1}
                                              onClick={() => handleShiftTopicOrder(idx, 'down', m.id)}
                                              className="p-1 text-slate-500 hover:text-cyan-400 disabled:opacity-20 transition"
                                            >
                                              <ArrowDown size={14} />
                                            </button>
                                            <button 
                                              onClick={() => handleOpenEditTopic(t, m.id)}
                                              className="p-1 text-slate-500 hover:text-emerald-400 transition"
                                            >
                                              <Edit3 size={14} />
                                            </button>
                                            <button 
                                              onClick={() => t.id && handleDeleteTopic(t.id, m.id)}
                                              className="p-1 text-slate-500 hover:text-red-400 transition"
                                            >
                                              <Trash2 size={14} />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Quiz Questions Section */}
                                <div className="space-y-3 pt-2">
                                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                    <Award size={12} className="text-yellow-500" /> Assessment Questions
                                  </h5>

                                  {(!m.quizQuestions || m.quizQuestions.length === 0) ? (
                                    <div className="text-[10px] text-slate-600 pl-4 py-2 font-semibold">No quiz questions defined for this week assessment.</div>
                                  ) : (
                                    <div className="space-y-2">
                                      {m.quizQuestions.map((q, idx) => (
                                        <div key={q.id} className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex items-center justify-between">
                                          <div className="space-y-1">
                                            <div className="text-xs font-bold text-slate-200">
                                              <span className="text-yellow-500 font-black mr-1">Q{idx + 1}.</span> {q.text}
                                            </div>
                                            <div className="text-[9px] text-slate-500 font-mono">
                                              Correct Ans: <span className="text-emerald-400 font-bold">{q.correctAnswer}</span>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-2">
                                            <button 
                                              onClick={() => handleOpenEditQuiz(q, m.id)}
                                              className="p-1 text-slate-500 hover:text-emerald-400 transition"
                                            >
                                              <Edit3 size={14} />
                                            </button>
                                            <button 
                                              onClick={() => q.id && handleDeleteQuiz(q.id, m.id)}
                                              className="p-1 text-slate-500 hover:text-red-400 transition"
                                            >
                                              <Trash2 size={14} />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs">Select a course track to begin syllabus adjustments.</div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">Candidate Accounts Registry</h3>
                <p className="text-xs text-slate-500 mt-1">Approve registrations, manage clearances, and promote administrative roles.</p>
              </div>

              {/* User search bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-850 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition font-medium"
                />
              </div>
            </div>

            {loadingUsers ? (
              <div className="py-12 text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fetching Candidate registers...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center py-10 text-xs text-slate-500 font-bold">No registered candidates found matching search.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 uppercase font-black tracking-widest text-[9px]">
                      <th className="py-3 px-4">Candidate / ID</th>
                      <th className="py-3 px-4">Academic Background</th>
                      <th className="py-3 px-4 text-center">Telemetry</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60">
                    {filteredUsers.map((u) => {
                      const initials = u.name ? u.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0,2) : 'ST';
                      const isCurrentUser = u.email === user?.email;
                      return (
                        <tr key={u.id} className="hover:bg-slate-950/20 transition">
                          <td className="py-4 px-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-850 border border-slate-700 text-slate-350 font-black text-[10px] flex items-center justify-center shrink-0">
                              {initials}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-200">{u.name}</h4>
                              <p className="text-[10px] text-slate-500 font-mono">{u.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-400">
                            <div>{u.collegeName || 'Self-Taught'}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold">{u.branchName || 'N/A'} Eng.</div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-black">
                              {u.points} XP
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                              u.role === 'ADMIN' 
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                : 'bg-slate-950 text-slate-455 border border-slate-850'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleUserVerification(u.id, u.isVerified)}
                              className={`p-1.5 rounded-lg border transition ${
                                u.isVerified 
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950'
                                  : 'bg-slate-950 border-slate-850 text-slate-450 hover:text-white'
                              }`}
                              title={u.isVerified ? 'Reject/Unverify Account' : 'Verify Account'}
                            >
                              <UserCheck size={14} />
                            </button>
                            
                            <button
                              disabled={isCurrentUser}
                              onClick={() => handleToggleUserRole(u.id, u.role)}
                              className={`p-1.5 rounded-lg border transition ${
                                u.role === 'ADMIN'
                                  ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-slate-950'
                                  : 'bg-slate-950 border-slate-850 text-slate-450 hover:text-white'
                              } disabled:opacity-20 disabled:cursor-not-allowed`}
                              title={u.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                            >
                              <Shield size={14} />
                            </button>

                            <button
                              disabled={isCurrentUser}
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 bg-slate-950 border border-slate-850 hover:border-red-500 text-slate-455 hover:text-red-400 rounded-lg transition disabled:opacity-20 disabled:cursor-not-allowed"
                              title="Delete Candidate Account"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}`
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            {/* Top row cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Candidates", value: users.length, icon: Users, color: "text-cyan-400 bg-cyan-400/5 border-cyan-400/15" },
                { title: "CMS Active Tracks", value: 20, icon: BookOpen, color: "text-emerald-400 bg-emerald-400/5 border-emerald-400/15" },
                { title: "Platform Points", value: `${users.reduce((acc, u) => acc + u.points, 0)} XP`, icon: Award, color: "text-amber-400 bg-amber-400/5 border-amber-400/15" },
                { title: "Audited Revenue", value: `₹${totalCount * 999}`, icon: DollarSign, color: "text-purple-400 bg-purple-400/5 border-purple-400/15" }
              ].map((card, idx) => (
                <div key={idx} className={`p-6 bg-slate-900 border rounded-3xl shadow-xl flex items-center justify-between ${card.color}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider block">{card.title}</span>
                    <span className="text-2xl font-black text-white">{card.value}</span>
                  </div>
                  <card.icon className="w-10 h-10 opacity-70" />
                </div>
              ))}
            </div>

            {/* Visual charts representation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category distribution */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4 shadow-xl">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">Category Popularity & Engagement</h3>
                <div className="space-y-4 pt-2">
                  {[
                    { category: "Programming & Algorithms", percentage: 65, color: "bg-cyan-500 shadow-cyan-900/50" },
                    { category: "Embedded Firmware & Electronics", percentage: 48, color: "bg-emerald-500 shadow-emerald-900/50" },
                    { category: "Emerging AI & Robotics Models", percentage: 32, color: "bg-purple-500 shadow-purple-900/50" }
                  ].map((bar, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>{bar.category}</span>
                        <span className="text-white">{bar.percentage}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-950 border border-slate-850 rounded-full overflow-hidden">
                        <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessment Health Tracker */}
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4 shadow-xl shrink-0">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">Academic Integrity</h3>
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-350">Final Exam Pass Ratio</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Threshold: &gt;= 60% accuracy</p>
                    </div>
                    <span className="text-lg font-black text-emerald-400 font-mono">76%</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-350">Practice Completion</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Avg attempts per student</p>
                    </div>
                    <span className="text-lg font-black text-cyan-400 font-mono">4.2</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-350">Verified Certificates</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">ISO audited registry</p>
                    </div>
                    <span className="text-lg font-black text-amber-400 font-mono">{totalCount} issued</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>      {/* Gorgeous Side-by-Side Live WYSIWYG Editor Modal (Issue #8) (COMPONENTIZED) */}
      <AnimatePresence>
        {editingTopic && (
          <TopicEditorModal
            editingTopic={editingTopic}
            isNewTopic={isNewTopic}
            onClose={() => setEditingTopic(null)}
            onSave={handleSaveTopic}
            onChange={(topic) => setEditingTopic(topic)}
            showLivePreview={showLivePreview}
            onTogglePreview={() => setShowLivePreview(!showLivePreview)}
            mockAssetUrl={mockAssetUrl}
            onChangeMockAssetUrl={(url) => setMockAssetUrl(url)}
            uploadingAsset={uploadingAsset}
            onMockAssetUpload={handleMockAssetUpload}
          />
        )}
      </AnimatePresence>

      {/* Quiz Question CRUD Editor Modal */}
      <AnimatePresence>
        {editingQuiz && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-left space-y-5"
            >
              <div className="flex items-center gap-2 text-yellow-400 pb-2 border-b border-slate-900">
                <Award size={18} />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  {isNewQuiz ? 'Create Quiz Question' : 'Modify Quiz Question'}
                </h3>
              </div>

              <div className="space-y-4">
                
                {/* Question Text */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Question Statement</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Which keyword stops switch fall-through in C?"
                    value={editingQuiz.text}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, text: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* Multiple choice Options */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Answer Options</label>
                  {editingQuiz.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex gap-2 items-center">
                      <span className="text-[10px] font-black text-slate-600 w-4 font-mono">[{String.fromCharCode(65 + oIdx)}]</span>
                      <input 
                        type="text"
                        required
                        placeholder={`Option ${String.fromCharCode(65 + oIdx)} text`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...editingQuiz.options];
                          newOpts[oIdx] = e.target.value;
                          setEditingQuiz({ ...editingQuiz, options: newOpts });
                        }}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Correct Answer (Must match correct Option string exactly)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. break"
                    value={editingQuiz.correctAnswer}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, correctAnswer: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-emerald-400 placeholder-slate-650 focus:outline-none focus:border-emerald-500 transition font-mono font-bold"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-900">
                <button 
                  onClick={() => setEditingQuiz(null)}
                  className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSaveQuiz}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-[0.98]"
                >
                  Commit Question
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;
