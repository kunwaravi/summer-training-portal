import { useState, useEffect, Fragment } from 'react';
import api from '../api';
import { useUI } from '../context/UIContext';
import {
  Shield, Users, Award, BookOpen, Edit3, Trash2, Plus,
  ArrowUp, ArrowDown, Eye, DollarSign,
  Save, FileText, Image, RefreshCw, ChevronDown, ChevronRight,
  TrendingUp, Share2, Mail, Settings, ClipboardCheck,
  Clock, CheckCircle2, XCircle, Check, X, FileCode2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminPaymentTable from '../components/organisms/AdminPaymentTable';
import { coursesConfig } from '../config/courses';

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

const courseTitleById = (id: string) => coursesConfig.find((c) => c.id === id)?.title || id;

const initialsOf = (name?: string) =>
  (name || '?').split(' ').map((n) => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || '?';

const AdminDashboard = () => {
  const { confirmDialog } = useUI();
  const [activeTab, setActiveTab] = useState<'transactions' | 'cms' | 'users' | 'analytics' | 'referrals' | 'messages' | 'settings' | 'review'>('transactions');

  // Transaction logs states
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  // Review queue states (#82)
  const [reviewTab, setReviewTab] = useState<'assignments' | 'projects'>('assignments');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingReview, setLoadingReview] = useState(true);
  const [evaluatingId, setEvaluatingId] = useState<number | null>(null);

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

  // Direct certificate states
  const [users, setUsers] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('C');

  // Referral tracker states
  const [referralSearch, setReferralSearch] = useState('');
  const [expandedReferrerId, setExpandedReferrerId] = useState<number | null>(null);

  // Candidate sorting states
  const [sortField, setSortField] = useState<'id' | 'name' | 'createdAt' | 'referralCount'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Course & Module creation states
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseId, setNewCourseId] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState(999);

  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [newModuleCourseId, setNewModuleCourseId] = useState('');
  const [newModuleWeek, setNewModuleWeek] = useState(1);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');

  // Contact Us Messages & Settings States
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [contactSettings, setContactSettings] = useState({
    COMPANY_NAME: '',
    WEBSITE_URL: '',
    CONTACT_EMAIL: '',
    CONTACT_PHONE: '',
    CONTACT_HOURS: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Candidate edit modal state
  const [editingCandidate, setEditingCandidate] = useState<any | null>(null);
  const [savingCandidate, setSavingCandidate] = useState(false);
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    email: '',
    fatherName: '',
    collegeName: '',
    branchName: '',
    courseType: 'Electronics',
    role: 'USER',
    certificateStartDate: '',
    certificateEndDate: ''
  });

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await api.get('/contact/messages');
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchContactSettings = async () => {
    try {
      const res = await api.get('/contact/settings');
      setContactSettings(res.data);
    } catch (err) {
      console.error('Failed to fetch contact settings:', err);
    }
  };

  const handleSaveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.put('/contact/settings', contactSettings);
      alert('System settings updated successfully!');
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      alert(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    const ok = await confirmDialog({ title: 'Delete message?', message: 'Are you sure you want to permanently delete this message?', confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    try {
      await api.delete(`/contact/messages/${id}`);
      alert('Message deleted successfully.');
      fetchMessages();
    } catch (err) {
      console.error('Failed to delete message:', err);
      alert('Failed to delete message.');
    }
  };

  const handleSort = (field: 'id' | 'name' | 'createdAt' | 'referralCount') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'createdAt') {
      aVal = aVal ? new Date(aVal).getTime() : 0;
      bVal = bVal ? new Date(bVal).getTime() : 0;
    }

    if (sortField === 'referralCount') {
      aVal = aVal || 0;
      bVal = bVal || 0;
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Fetch initial payment transactions for audit dashboard
  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const res = await api.get('/payments/admin/all');
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch payment list:', err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Fetch full submission queues for the review tab (#82)
  const fetchReview = async () => {
    setLoadingReview(true);
    try {
      const [assignRes, projectRes] = await Promise.all([
        api.get('/assignments/admin/all'),
        api.get('/projects/admin/all'),
      ]);
      setAssignments(assignRes.data?.submissions ?? []);
      setProjects(projectRes.data?.submissions ?? []);
    } catch (err) {
      console.error('Failed to load review queue:', err);
    } finally {
      setLoadingReview(false);
    }
  };

  // Approve / reject a submission; awards XP server-side on approve
  const handleEvaluate = async (submission: any, isProject: boolean, status: 'APPROVED' | 'REJECTED') => {
    const ok = await confirmDialog({
      title: `${status === 'APPROVED' ? 'Approve' : 'Reject'} ${isProject ? 'project' : 'assignment'}`,
      message: `Mark the ${isProject ? 'project' : 'assignment'} by "${submission.user?.name}" as ${status.toLowerCase()}?${status === 'APPROVED' ? ` This awards ${isProject ? '100' : '20'} XP instantly.` : ''}`,
      confirmLabel: status === 'APPROVED' ? 'Approve' : 'Reject',
      danger: status === 'REJECTED',
    });
    if (!ok) return;
    setEvaluatingId(submission.id);
    try {
      const endpoint = isProject ? `/projects/admin/evaluate/${submission.id}` : `/assignments/admin/evaluate/${submission.id}`;
      await api.put(endpoint, { status });
      await fetchReview();
    } catch (err: any) {
      console.error('Evaluate failed:', err);
      alert(err.response?.data?.message || 'Failed to update submission.');
    } finally {
      setEvaluatingId(null);
    }
  };

  // Fetch all registered users for certificate generator & directory
  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/admin/users');
      setUsers(res.data);
      if (res.data.length > 0) {
        setSelectedStudentId(res.data[0].id.toString());
      }
    } catch (err) {
      console.error('Failed to load users for dropdown:', err);
    }
  };

  // Delete candidate account and all dependencies
  const handleDeleteUser = async (userId: number, userName: string) => {
    const ok = await confirmDialog({
      title: 'Delete user account?',
      message: `Are you sure you want to permanently delete "${userName}"? All their progress, results, certificates, and submissions will be permanently wiped out. This cannot be undone.`,
      confirmLabel: 'Delete User',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.delete(`/auth/admin/users/${userId}`);
      alert(`User "${userName}" was successfully deleted.`);
      fetchUsers(); // Refresh the users list
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleOpenEditCandidate = (candidate: any) => {
    // Convert stored ISO/Date to YYYY-MM-DD for <input type="date">
    const toDateInput = (d: any) => d ? new Date(d).toISOString().slice(0, 10) : '';
    setEditingCandidate(candidate);
    setCandidateForm({
      name: candidate.name || '',
      email: candidate.email || '',
      fatherName: candidate.fatherName || '',
      collegeName: candidate.collegeName || '',
      branchName: candidate.branchName || '',
      courseType: candidate.courseType || 'Electronics',
      role: candidate.role || 'USER',
      certificateStartDate: toDateInput(candidate.certificateStartDate),
      certificateEndDate: toDateInput(candidate.certificateEndDate)
    });
  };

  const handleSaveCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;
    setSavingCandidate(true);
    try {
      await api.put(`/auth/admin/users/${editingCandidate.id}`, candidateForm);
      alert('Candidate profile updated successfully!');
      setEditingCandidate(null);
      fetchUsers();
    } catch (err: any) {
      console.error('Failed to update candidate profile:', err);
      alert(err.response?.data?.message || 'Failed to update candidate profile.');
    } finally {
      setSavingCandidate(false);
    }
  };

  // Fetch syllabus courses and dynamic module data
  const fetchCmsCourses = async (courseIdToSelect?: string) => {
    setLoadingCms(true);
    try {
      const res = await api.get('/courses');
      // Format backend schema structure
      const formatted: Course[] = res.data.map((c: any) => ({
        id: c.id,
        title: c.title,
        description: c.description || '',
        modules: c.modules || []
      }));
      setCourses(formatted);
      if (formatted.length > 0) {
        const preserveId = courseIdToSelect || selectedCourse?.id;
        const matched = formatted.find(c => c.id === preserveId);
        setSelectedCourse(matched || formatted[0]);
      } else {
        setSelectedCourse(null);
      }
    } catch (err) {
      console.error('Failed to load courses for CMS:', err);
    } finally {
      setLoadingCms(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseId || !newCourseTitle) {
      alert('Course ID and Title are required.');
      return;
    }
    try {
      const payload = {
        id: newCourseId.trim(),
        title: newCourseTitle.trim(),
        description: newCourseDesc.trim(),
        price: Number(newCoursePrice)
      };
      await api.post('/courses', payload);
      alert(`Course "${newCourseTitle}" created successfully.`);
      
      const createdId = newCourseId.trim();
      // Clear fields
      setNewCourseId('');
      setNewCourseTitle('');
      setNewCourseDesc('');
      setNewCoursePrice(999);
      setShowAddCourseModal(false);

      // Refresh list and select the newly created course
      await fetchCmsCourses(createdId);
    } catch (err: any) {
      console.error('Failed to create course:', err);
      alert(err.response?.data?.message || 'Failed to create course.');
    }
  };

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    const ok = await confirmDialog({
      title: 'Delete course?',
      message: `Are you sure you want to permanently delete "${courseTitle}" (${courseId})? All modules, topics, and quiz questions associated with this course will be permanently wiped out.`,
      confirmLabel: 'Delete Course',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.delete(`/courses/${courseId}`);
      alert(`Course "${courseTitle}" was successfully deleted.`);
      // Refresh list of courses
      await fetchCmsCourses();
    } catch (err: any) {
      console.error('Failed to delete course:', err);
      alert(err.response?.data?.message || 'Failed to delete course. Ensure no students have active progress or payments for this course first.');
    }
  };

  const handleAddModuleClick = (courseId: string) => {
    const activeCourse = courses.find(c => c.id === courseId);
    const nextWeek = activeCourse && activeCourse.modules ? activeCourse.modules.length + 1 : 1;
    setNewModuleCourseId(courseId);
    setNewModuleWeek(nextWeek);
    setNewModuleTitle('');
    setNewModuleDesc('');
    setShowAddModuleModal(true);
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleCourseId || !newModuleTitle) {
      alert('Module Title is required.');
      return;
    }
    try {
      const payload = {
        week: Number(newModuleWeek),
        title: newModuleTitle.trim(),
        description: newModuleDesc.trim()
      };
      await api.post(`/courses/${newModuleCourseId}/module`, payload);
      alert(`Week ${newModuleWeek} Module created successfully.`);
      
      const targetCourseId = newModuleCourseId;
      // Clear fields
      setNewModuleCourseId('');
      setNewModuleWeek(1);
      setNewModuleTitle('');
      setNewModuleDesc('');
      setShowAddModuleModal(false);

      // Refresh list
      await fetchCmsCourses(targetCourseId);
    } catch (err: any) {
      console.error('Failed to create module:', err);
      alert(err.response?.data?.message || 'Failed to create module.');
    }
  };

  const handleDeleteModule = async (moduleId: number, weekNum: number) => {
    const ok = await confirmDialog({
      title: 'Delete module?',
      message: `Are you sure you want to permanently delete Week ${weekNum} Module? This will wipe out all topics and quiz questions in this module.`,
      confirmLabel: 'Delete Module',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.delete(`/courses/module/${moduleId}`);
      alert(`Week ${weekNum} Module deleted successfully.`);
      await fetchCmsCourses(selectedCourse?.id);
    } catch (err: any) {
      console.error('Failed to delete module:', err);
      alert(err.response?.data?.message || 'Failed to delete module.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
      fetchCmsCourses();
      fetchUsers();
      fetchMessages();
      fetchContactSettings();
      fetchReview();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Fetch all topics and quiz questions for a module once expanded
  const handleToggleExpandModule = async (moduleId: number, courseId: string, week: number, forceRefresh = false) => {
    if (expandedModuleId === moduleId && !forceRefresh) {
      setExpandedModuleId(null);
      return;
    }

    try {
      const res = await api.get(`/courses/${courseId}/module/${week}`);
      const detailedModule = res.data;
      
      // Also fetch quiz questions from REST API
      const quizRes = await api.get(`/quiz/questions/${courseId}/${week}`);
      
      // Update local state with both rich details and quiz questions in one batch to prevent race condition/state overwrite
      if (selectedCourse) {
        const updatedModules = selectedCourse.modules?.map(m => 
          m.id === moduleId ? { ...m, topics: detailedModule.topics, quizQuestions: quizRes.data.questions } : m
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
        await handleToggleExpandModule(topicModuleId, selectedCourse.id, activeModule.week, true);
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
    const ok = await confirmDialog({ title: 'Delete topic?', message: 'Are you sure you want to permanently delete this topic?', confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    try {
      await api.delete(`/courses/topic/${topicId}`);
      if (selectedCourse) {
        const activeModule = selectedCourse.modules?.find(m => m.id === moduleId);
        if (activeModule) {
          await handleToggleExpandModule(moduleId, selectedCourse.id, activeModule.week, true);
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
      
      await handleToggleExpandModule(moduleId, selectedCourse.id, activeModule.week, true);
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
        await handleToggleExpandModule(quizModuleId, selectedCourse.id, activeModule.week, true);
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
    const ok = await confirmDialog({ title: 'Delete question?', message: 'Are you sure you want to permanently delete this quiz question?', confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    try {
      await api.delete(`/quiz/question/${quizId}`);
      if (selectedCourse) {
        const activeModule = selectedCourse.modules?.find(m => m.id === moduleId);
        if (activeModule) {
          await handleToggleExpandModule(moduleId, selectedCourse.id, activeModule.week, true);
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

  // Review queue derived data (#82)
  const reviewIsProject = reviewTab === 'projects';
  const reviewItems = reviewIsProject ? projects : assignments;
  const reviewPending = reviewItems.filter((s) => s.status === 'PENDING').length;
  const reviewApprovedToday = reviewItems.filter(
    (s) => s.status === 'APPROVED' && new Date(s.updatedAt).toDateString() === new Date().toDateString()
  ).length;
  const reviewRejected = reviewItems.filter((s) => s.status === 'REJECTED').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 px-2">
      
      {/* Admin Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Staff Portal & Course CMS
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Nexus Corporate Academic Accreditations & Content Editors</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { fetchTransactions(); fetchCmsCourses(); }}
            className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all"
            title="Reload Data"
            aria-label="Reload data"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Tabs — active pill, bigger icons, horizontal scroll on mobile (#89) */}
      <div className="overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:thin] [scrollbar-color:#94a3b8_transparent]">
        <div className="flex items-center gap-1.5 w-max">
          {[
            { id: 'transactions' as const, label: 'Payment Audits', icon: <DollarSign size={20} className="shrink-0" /> },
            { id: 'cms' as const, label: 'Course Syllabus CMS', icon: <BookOpen size={20} className="shrink-0" /> },
            { id: 'users' as const, label: 'User Management', icon: <Users size={20} className="shrink-0" /> },
            { id: 'referrals' as const, label: 'Referral Tracker', icon: <Share2 size={20} className="shrink-0" /> },
            { id: 'analytics' as const, label: 'Analytics', icon: <TrendingUp size={20} className="shrink-0" /> },
            { id: 'messages' as const, label: 'Contact Messages', icon: <Mail size={20} className="shrink-0" /> },
            { id: 'settings' as const, label: 'Contact Settings', icon: <Settings size={20} className="shrink-0" /> },
            { id: 'review' as const, label: 'Review Queue', icon: <ClipboardCheck size={20} className="shrink-0" /> },
          ].map((tab) => {
            const pendingTotal = tab.id === 'review'
              ? assignments.filter((s) => s.status === 'PENDING').length + projects.filter((s) => s.status === 'PENDING').length
              : 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-extrabold uppercase tracking-wide transition flex items-center gap-2.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 shadow-lg shadow-cyan-500/5 dark:shadow-cyan-500/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60 border border-transparent'
                }`}
                aria-pressed={activeTab === tab.id}
              >
                {tab.icon}
                {tab.label}
                {tab.id === 'review' && pendingTotal > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[11px] font-black">
                    {pendingTotal}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">

        {/* ── Review Queue (#82) ─────────────────────────────────────────── */}
        {activeTab === 'review' && (
          <div className="space-y-6 animate-fade-in">
            {/* Sub-tabs: Assignments / Projects */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Review Queue</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Evaluate student submissions inline — approvals award XP instantly.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setReviewTab('assignments')}
                  className={`px-4 py-2 rounded-xl border text-[13px] font-bold transition ${
                    reviewTab === 'assignments'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/40'
                  }`}
                  aria-pressed={reviewTab === 'assignments'}
                >
                  Assignments
                  {assignments.filter((s) => s.status === 'PENDING').length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[11px] font-black">
                      {assignments.filter((s) => s.status === 'PENDING').length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setReviewTab('projects')}
                  className={`px-4 py-2 rounded-xl border text-[13px] font-bold transition ${
                    reviewTab === 'projects'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/40'
                  }`}
                  aria-pressed={reviewTab === 'projects'}
                >
                  Projects
                  {projects.filter((s) => s.status === 'PENDING').length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[11px] font-black">
                      {projects.filter((s) => s.status === 'PENDING').length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Stat row: Pending / Approved today / Rejected */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock size={12} className="text-amber-500" /> Pending
                </p>
                <p className="text-2xl font-black mt-1 text-slate-900 dark:text-white">{reviewPending}</p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-500" /> Approved today
                </p>
                <p className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{reviewApprovedToday}</p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <XCircle size={12} className="text-rose-500" /> Rejected
                </p>
                <p className="text-2xl font-black mt-1 text-rose-500 dark:text-rose-400">{reviewRejected}</p>
              </div>
            </div>

            {/* Submissions table */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {loadingReview ? (
                <div className="py-16 text-center space-y-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto"></div>
                  <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Loading {reviewIsProject ? 'projects' : 'assignments'}...</p>
                </div>
              ) : reviewItems.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <FileCode2 size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No {reviewIsProject ? 'projects' : 'assignments'} submitted yet</p>
                  <p className="text-xs text-slate-500">New student submissions will appear here for review.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[680px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <th className="px-5 py-3">Student</th>
                        <th className="px-5 py-3">Deliverable</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-[13px]">
                      {reviewItems.map((s) => {
                        const xpAwarded = reviewIsProject ? 100 : 20;
                        return (
                          <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xs font-black flex items-center justify-center shrink-0">
                                  {initialsOf(s.user?.name)}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{s.user?.name}</p>
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {courseTitleById(s.courseId)}{s.weekNumber ? ` · Week ${s.weekNumber}` : ''}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <a
                                href={reviewIsProject ? s.sourceCodeUrl : s.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[12px] hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-300 transition"
                                title="Open submission file"
                              >
                                <FileCode2 size={13} className="shrink-0" />
                                <span className="max-w-[180px] truncate">{reviewIsProject ? s.title : s.fileName}</span>
                              </a>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                                s.status === 'APPROVED'
                                  ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                  : s.status === 'REJECTED'
                                  ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400'
                                  : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400'
                              }`}>
                                {s.status === 'APPROVED' ? 'Approved' : s.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              {s.status === 'PENDING' ? (
                                <div className="inline-flex gap-2">
                                  <button
                                    onClick={() => handleEvaluate(s, reviewIsProject, 'APPROVED')}
                                    disabled={evaluatingId === s.id}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase flex items-center gap-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Check size={13} /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleEvaluate(s, reviewIsProject, 'REJECTED')}
                                    disabled={evaluatingId === s.id}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-black uppercase flex items-center gap-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <X size={13} /> Reject
                                  </button>
                                </div>
                              ) : s.status === 'APPROVED' ? (
                                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-black uppercase">
                                  +{xpAwarded} XP ✓
                                </span>
                              ) : (
                                <span className="text-[11px] text-rose-500 dark:text-rose-400 font-black uppercase">No XP</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6 animate-fade-in">
            {/* Direct Certificate Access Console */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="pb-2 border-b border-slate-800/80">
                <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Award size={18} className="text-cyan-400" /> Direct Certificate Access Console
                </h3>
                <p className="text-slate-400 text-xs mt-1">Select any registered student and track to generate/preview their certificate instantly, bypassing payment & completion rules.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[11px] uppercase font-black tracking-wider text-slate-400">Select Student</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full sm:w-1/3 space-y-1.5">
                  <label className="text-[11px] uppercase font-black tracking-wider text-slate-400">Select Track</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {coursesConfig.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    if (selectedStudentId) {
                      window.open(`/certificate?courseId=${encodeURIComponent(selectedCourseId)}&userId=${selectedStudentId}`, '_blank');
                    }
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-750 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow active:scale-95 disabled:opacity-50"
                  disabled={!selectedStudentId}
                >
                  View Certificate
                </button>
              </div>
            </div>

            <AdminPaymentTable 
              transactions={transactions} 
              loading={loadingTransactions}
              onVerified={fetchTransactions}
            />
          </div>
        )}

        {activeTab === 'cms' && (
          /* Advanced Interactive CMS Syllabus Builder (Issue #8) */
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Sidebar Tracks */}
            <div className="w-full lg:w-1/4 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-3 shrink-0">
              <div className="flex justify-between items-center px-2 pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-350">
                  Learning Tracks
                </h3>
                <button
                  onClick={() => setShowAddCourseModal(true)}
                  className="px-2 py-1 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded text-[11px] font-black uppercase transition flex items-center gap-1 focus:outline-none"
                  title="Create New Course Track"
                >
                  <Plus size={11} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {courses.map((c) => (
                  <div
                    key={c.id}
                    className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${
                      selectedCourse?.id === c.id
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-white font-extrabold shadow shadow-cyan-500/5'
                        : 'bg-slate-850/20 border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => { setSelectedCourse(c); setExpandedModuleId(null); }}
                      className="flex-1 text-left text-xs uppercase font-black tracking-wider focus:outline-none truncate pr-2"
                      title={c.title}
                    >
                      {c.id}
                    </button>
                    <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleDeleteCourse(c.id, c.title)}
                        className="p-1 hover:bg-slate-800 rounded text-rose-500 transition focus:outline-none"
                        title="Delete Course Track"
                        aria-label="Delete course track"
                      >
                        <Trash2 size={12} />
                      </button>
                      <ChevronRight size={14} className="text-slate-500" />
                    </div>
                  </div>
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
                      <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {selectedCourse.id} Curriculum Console
                      </span>
                      <h2 className="text-lg font-black text-white mt-1.5">Syllabus Weeks & Modules</h2>
                    </div>
                    <button
                      onClick={() => handleAddModuleClick(selectedCourse.id)}
                      className="px-3 py-2 bg-slate-850 hover:bg-slate-800 text-cyan-400 hover:text-white border border-slate-800 rounded-xl text-xs font-black uppercase transition flex items-center gap-1.5 focus:outline-none"
                    >
                      <Plus size={14} /> Add Week Module
                    </button>
                  </div>

                  {/* Modules Accordions */}
                  <div className="space-y-4">
                    {(!selectedCourse.modules || selectedCourse.modules.length === 0) ? (
                      <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl text-sm font-semibold">
                        No syllabus weeks/modules defined for this course yet.<br />
                        <button
                          onClick={() => handleAddModuleClick(selectedCourse.id)}
                          className="mt-3 px-4 py-2 bg-cyan-500 text-slate-950 rounded-xl text-xs font-black uppercase hover:bg-cyan-600 transition inline-flex items-center gap-1 focus:outline-none"
                        >
                          <Plus size={13} /> Add Week 1 Module
                        </button>
                      </div>
                    ) : (
                      selectedCourse.modules.map((m) => {
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
                                  <p className="text-[11px] text-slate-500 truncate max-w-[320px]">{m.description}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2.5" onClick={e => e.stopPropagation()}>
                                <button 
                                  onClick={() => handleOpenAddTopic(m.id)}
                                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white rounded-lg text-[11px] font-bold uppercase transition flex items-center gap-1"
                                >
                                  <Plus size={12} /> Add Topic
                                </button>
                                <button 
                                  onClick={() => handleOpenAddQuiz(m.id)}
                                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 hover:text-white rounded-lg text-[11px] font-bold uppercase transition flex items-center gap-1"
                                >
                                  <Plus size={12} /> Add Quiz Q
                                </button>
                                <button 
                                  onClick={() => handleDeleteModule(m.id, m.week)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-500 hover:text-white rounded-lg text-[11px] font-bold transition flex items-center justify-center"
                                  title="Delete Module"
                                  aria-label="Delete module"
                                >
                                  <Trash2 size={12} />
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
                                  <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                    <FileText size={12} /> Topic Curriculum Blocks
                                  </h5>

                                  {(!m.topics || m.topics.length === 0) ? (
                                    <div className="text-[11px] text-slate-600 pl-4 py-2 font-semibold">No topics defined for this week. Click 'Add Topic' above.</div>
                                  ) : (
                                    <div className="space-y-2">
                                      {m.topics.map((t, idx) => (
                                        <div key={t.id} className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex items-center justify-between group/row">
                                          <div className="flex items-center gap-3">
                                            <span className="text-[11px] font-bold text-slate-600">#{idx + 1}</span>
                                            <div>
                                              <span className="text-xs font-bold text-slate-200">{t.title}</span>
                                              {t.code && <span className="ml-2 text-[11px] bg-cyan-500/10 border border-cyan-500/25 px-1.5 py-0.5 rounded text-cyan-400 font-mono">Code</span>}
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
                                  <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                    <Award size={12} className="text-yellow-500" /> Assessment Questions
                                  </h5>

                                  {(!m.quizQuestions || m.quizQuestions.length === 0) ? (
                                    <div className="text-[11px] text-slate-600 pl-4 py-2 font-semibold">No quiz questions defined for this week assessment.</div>
                                  ) : (
                                    <div className="space-y-2">
                                      {m.quizQuestions.map((q, idx) => (
                                        <div key={q.id} className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex items-center justify-between">
                                          <div className="space-y-1">
                                            <div className="text-xs font-bold text-slate-200">
                                              <span className="text-yellow-500 font-black mr-1">Q{idx + 1}.</span> {q.text}
                                            </div>
                                            <div className="text-[11px] text-slate-500 font-mono">
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
                    }))}
                  </div>

                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs">Select a course track to begin syllabus adjustments.</div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
              <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Users size={18} className="text-cyan-400" /> Registered Candidate Directory
              </h3>
              <span className="text-[11px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400 font-bold">
                {users.length} Candidates Registered
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-450 uppercase font-black tracking-wider">
                    <th className="py-3 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('id')}>
                      Student ID {sortField === 'id' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                    </th>
                    <th className="py-3 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                      Candidate Name {sortField === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                    </th>
                    <th className="py-3 px-4">Academic Details</th>
                    <th className="py-3 px-4">Pursuing Courses</th>
                    <th className="py-3 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('referralCount')}>
                      Referrals {sortField === 'referralCount' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                    </th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('createdAt')}>
                      Registration Date {sortField === 'createdAt' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                    </th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {sortedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40 text-slate-300 transition">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-cyan-400">#{u.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.collegeName ? (
                          <>
                            <div className="font-semibold text-slate-350">{u.collegeName}</div>
                            <div className="text-[11px] text-slate-500 uppercase font-bold">{u.branchName || 'N/A'} Branch</div>
                          </>
                        ) : (
                          <span className="text-slate-600 italic">No academic profiles updated</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            const courseMap = new Map<string, { progress?: number; paid?: boolean; pending?: boolean }>();
                            
                            // 1. Add progresses info
                            if (u.progresses) {
                              u.progresses.forEach((p: any) => {
                                courseMap.set(p.courseId, { progress: p.progress });
                              });
                            }
                            
                            // 2. Add payments info
                            if (u.payments) {
                              u.payments.forEach((py: any) => {
                                const existing = courseMap.get(py.courseId) || {};
                                if (py.status === 'VERIFIED') {
                                  courseMap.set(py.courseId, { ...existing, paid: true });
                                } else if (py.status === 'PENDING_VERIFICATION') {
                                  courseMap.set(py.courseId, { ...existing, pending: true });
                                }
                              });
                            }
                            
                            if (courseMap.size === 0) {
                              return <span className="text-slate-600 italic text-[11px]">Not Enrolled</span>;
                            }
                            
                            return Array.from(courseMap.entries()).map(([courseId, info]) => {
                              let badgeText = `${courseId}`;
                              let badgeStyle = "border-blue-500/20 bg-blue-500/5 text-blue-400";
                              
                              if (info.progress !== undefined) {
                                badgeText += ` (${info.progress}%)`;
                              } else {
                                badgeText += ` (0%)`;
                              }
                              
                              if (info.paid) {
                                badgeText += ` [Paid]`;
                                badgeStyle = "border-emerald-500/25 bg-emerald-500/10 text-emerald-400";
                              } else if (info.pending) {
                                badgeText += ` [Pending]`;
                                badgeStyle = "border-amber-500/25 bg-amber-500/10 text-amber-400";
                              }
                              
                              return (
                                <span
                                  key={courseId}
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-black uppercase tracking-wider ${badgeStyle}`}
                                  title={`Course: ${courseId}`}
                                >
                                  {badgeText}
                                </span>
                              );
                            });
                          })()}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-left">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-200">
                            Code: <span className="font-mono text-[11px] text-cyan-400">{u.referralCode || 'N/A'}</span>
                          </div>
                          {u.referredBy && (
                            <div className="text-[11px] text-slate-500">
                              Referred By: <span className="font-mono">{u.referredBy}</span>
                            </div>
                          )}
                          <div className="text-[11px] text-emerald-450 font-bold">
                            Refers: {u.referralCount || 0} (Paid: {u.referralPaidCount || 0})
                          </div>
                          {u.referralSuccess && (
                            <span className="inline-flex px-1.5 py-0.5 rounded text-[11px] font-black uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                              100% OFF Unlocked
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase ${
                          u.role === 'ADMIN'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/25'
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenEditCandidate(u)}
                          className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 rounded-lg transition active:scale-90 mr-1.5"
                          title="Edit Candidate Profile"
                          aria-label="Edit candidate profile"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-lg transition active:scale-90"
                          title="Remove Candidate"
                          aria-label="Remove candidate"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Candidate Profile Modal */}
            {editingCandidate && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Edit3 size={18} className="text-cyan-400" /> Edit Candidate Profile
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Candidate ID: #{editingCandidate.id}</p>
                    </div>
                    <button
                      onClick={() => setEditingCandidate(null)}
                      aria-label="Close edit candidate dialog"
                      className="text-slate-500 hover:text-white p-1 rounded-lg text-lg"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveCandidate} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-black uppercase text-slate-400">Full Name</label>
                        <input
                          type="text"
                          required
                          value={candidateForm.name}
                          onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-black uppercase text-slate-400">Email Address</label>
                        <input
                          type="email"
                          required
                          value={candidateForm.email}
                          onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-black uppercase text-slate-400">Father's Name</label>
                        <input
                          type="text"
                          value={candidateForm.fatherName}
                          onChange={(e) => setCandidateForm({ ...candidateForm, fatherName: e.target.value })}
                          placeholder="e.g. Ramesh Sharma"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-black uppercase text-slate-400">Role</label>
                        <select
                          value={candidateForm.role}
                          onChange={(e) => setCandidateForm({ ...candidateForm, role: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="USER">USER (Student)</option>
                          <option value="ADMIN">ADMIN (Staff)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-black uppercase text-slate-400">College Name</label>
                        <input
                          type="text"
                          value={candidateForm.collegeName}
                          onChange={(e) => setCandidateForm({ ...candidateForm, collegeName: e.target.value })}
                          placeholder="e.g. COEP Technological University"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-black uppercase text-slate-400">Branch Name</label>
                        <input
                          type="text"
                          value={candidateForm.branchName}
                          onChange={(e) => setCandidateForm({ ...candidateForm, branchName: e.target.value })}
                          placeholder="e.g. ECE / CSE / Mechanical"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-black uppercase text-slate-400">Certificate Start Date</label>
                        <input
                          type="date"
                          value={candidateForm.certificateStartDate}
                          onChange={(e) => setCandidateForm({ ...candidateForm, certificateStartDate: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-black uppercase text-slate-400">Certificate End Date</label>
                        <input
                          type="date"
                          value={candidateForm.certificateEndDate}
                          onChange={(e) => setCandidateForm({ ...candidateForm, certificateEndDate: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 -mt-2">These dates are shown on the certificate. Leave empty to auto-derive from registration date.</p>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setEditingCandidate(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingCandidate}
                        className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow disabled:opacity-50"
                      >
                        {savingCandidate ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
              <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Mail size={18} className="text-cyan-400" /> Contact Messages Registry
              </h3>
              <span className="text-[11px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400 font-bold">
                {messages.length} Messages
              </span>
            </div>

            {loadingMessages ? (
              <div className="py-12 text-center text-slate-500 font-semibold text-sm">Loading contact messages...</div>
            ) : messages.length === 0 ? (
              <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl text-sm font-semibold text-slate-400">
                No messages submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-450 uppercase font-black tracking-wider">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">From</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Message</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {messages.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-900/40 text-slate-300 transition align-top">
                        <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                          {new Date(m.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{m.name}</div>
                          <div className="text-[11px] text-slate-550 font-mono">{m.email}</div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-350">{m.subject || 'N/A'}</td>
                        <td className="py-3.5 px-4 max-w-sm whitespace-pre-wrap leading-relaxed text-slate-405">{m.message}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteMessage(m.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-lg transition"
                            title="Remove Message"
                            aria-label="Remove message"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
            <div className="pb-2 border-b border-slate-800/80">
              <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Settings size={18} className="text-cyan-400" /> Contact Support Settings
              </h3>
              <p className="text-slate-400 text-xs mt-1">Configure company support metadata and contact desk parameters shown across the public portal.</p>
            </div>

            <form onSubmit={handleSaveContactSettings} className="space-y-4 max-w-xl">
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-450">Company Name</label>
                <input 
                  type="text"
                  required
                  value={contactSettings.COMPANY_NAME}
                  onChange={(e) => setContactSettings(prev => ({ ...prev, COMPANY_NAME: e.target.value }))}
                  placeholder="e.g. EduNexus Pro"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-450">Website URL</label>
                <input 
                  type="url"
                  required
                  value={contactSettings.WEBSITE_URL}
                  onChange={(e) => setContactSettings(prev => ({ ...prev, WEBSITE_URL: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-855 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-450">Support Email</label>
                <input 
                  type="email"
                  required
                  value={contactSettings.CONTACT_EMAIL}
                  onChange={(e) => setContactSettings(prev => ({ ...prev, CONTACT_EMAIL: e.target.value }))}
                  placeholder="support@..."
                  className="w-full bg-slate-950 border border-slate-855 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-450">Contact Mobile Number</label>
                <input 
                  type="text"
                  required
                  value={contactSettings.CONTACT_PHONE}
                  onChange={(e) => setContactSettings(prev => ({ ...prev, CONTACT_PHONE: e.target.value }))}
                  placeholder="+91..."
                  className="w-full bg-slate-950 border border-slate-855 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-450">Business Hours</label>
                <input 
                  type="text"
                  required
                  value={contactSettings.CONTACT_HOURS}
                  onChange={(e) => setContactSettings(prev => ({ ...prev, CONTACT_HOURS: e.target.value }))}
                  placeholder="Monday to Saturday | 10:00 AM - 6:00 PM (IST)"
                  className="w-full bg-slate-950 border border-slate-855 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-750 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow active:scale-95 disabled:opacity-50"
              >
                <Save size={14} /> {savingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in text-slate-350">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Enrolled', value: '1,250', change: '+12% this week', isUp: true },
                { label: 'Completion Rate', value: '78.4%', change: '+3.2% vs last month', isUp: true },
                { label: 'Avg Quiz Accuracy', value: '81.2%', change: '-0.5% vs yesterday', isUp: false },
                { label: 'Active Certificates', value: '412', change: '+24 issued today', isUp: true },
              ].map((card, idx) => (
                <div key={idx} className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">{card.label}</span>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-black text-white">{card.value}</h3>
                    <span className={`text-[11px] font-bold ${card.isUp ? 'text-emerald-400' : 'text-rose-450'}`}>
                      {card.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Funnels & Cohort Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cohort Drop-off Analysis */}
              <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Learner Funnel (Drop-off)</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Percentage of registered students reaching each learning milestone.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { milestone: 'Registered & Profiles Setup', count: 1250, pct: 100, color: 'bg-blue-500' },
                    { milestone: 'Enrolled in 1+ Tracks', count: 1080, pct: 86.4, color: 'bg-indigo-500' },
                    { milestone: 'Completed Week 1 Quiz', count: 890, pct: 71.2, color: 'bg-purple-500' },
                    { milestone: 'Completed Week 5 Quiz', count: 620, pct: 49.6, color: 'bg-pink-500' },
                    { milestone: 'Completed Week 10 Quiz', count: 480, pct: 38.4, color: 'bg-amber-500' },
                    { milestone: 'Claimed Certificate (₹499 Paid)', count: 412, pct: 32.9, color: 'bg-emerald-500' }
                  ].map((m, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-350">{m.milestone}</span>
                        <span className="text-slate-500 font-mono">{m.count} students ({m.pct}%)</span>
                      </div>
                      <div className="h-3 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-slate-900">
                        <div 
                          className={`h-full ${m.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${m.pct}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Track Performance comparison */}
              <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Track Distribution & Popularity</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Enrollment split and certificates generated by training track.</p>
                </div>
                <div className="space-y-5 pt-2">
                  {[
                    { track: 'C & Systems Programming', enrollments: 450, certs: 180, pct: 82 },
                    { track: 'C++ & OOP Embedded', enrollments: 320, certs: 110, pct: 64 },
                    { track: 'IoT & Smart Interfacing', enrollments: 280, certs: 74, pct: 56 },
                    { track: 'Embedded Systems & RTOS', enrollments: 200, certs: 48, pct: 40 }
                  ].map((t, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-24 text-xs font-bold text-slate-400 truncate" title={t.track}>{t.track.split(' & ')[0]}</div>
                      <div className="flex-1 flex items-center gap-3">
                        {/* Bar comparison */}
                        <div className="flex-1 h-6 bg-slate-950 rounded-lg overflow-hidden border border-slate-900 relative">
                          <div 
                            className="h-full bg-cyan-500/10 border-r-2 border-cyan-400 flex items-center justify-end pr-2 transition-all duration-1000"
                            style={{ width: `${t.pct}%` }}
                          >
                            <span className="text-[11px] font-black text-cyan-400 font-mono">{t.pct}% active</span>
                          </div>
                        </div>
                        <div className="text-[11px] font-bold text-slate-500 shrink-0 text-right w-24">
                          {t.enrollments} enr / {t.certs} cert
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-[11px] leading-relaxed text-blue-300">
                  <strong>Founder Insight:</strong> C Programming remains the absolute gateway track with 36% of all traffic. 
                  Week 1 and 2 quiz results show high retention, with a 14% drop-off at Week 3 when register-masking and pointers concepts are introduced.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="space-y-6 animate-fade-in text-slate-350">
            {/* Referral Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Card 1: Total Referred */}
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Total Referred Students</span>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-black text-white">
                    {users.filter(u => u.referredBy).length}
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-400">
                    Signups via Code
                  </span>
                </div>
              </div>
              
              {/* Card 2: Top Referrer */}
              {(() => {
                const top = users.reduce((prev, current) => {
                  return (prev.referralCount || 0) > (current.referralCount || 0) ? prev : current;
                }, { name: 'N/A', referralCount: 0 });
                return (
                  <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Top Referrer</span>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-sm font-black text-white truncate max-w-[150px]" title={top.name}>
                        {top.name}
                      </h3>
                      <span className="text-[14px] font-extrabold text-cyan-400">
                        {top.referralCount || 0} Refers
                      </span>
                    </div>
                  </div>
                );
              })()}
              
              {/* Card 3: Referral Paid Conversion */}
              {(() => {
                const totalReferred = users.filter(u => u.referredBy).length;
                const paidReferred = users.filter(u => u.referredBy && u.payments?.some((p: any) => p.status === 'VERIFIED')).length;
                const conversionRate = totalReferred > 0 ? ((paidReferred / totalReferred) * 100).toFixed(1) : '0';
                return (
                  <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Paid Conversion Rate</span>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-2xl font-black text-emerald-400">
                        {conversionRate}%
                      </h3>
                      <span className="text-[11px] font-bold text-slate-400">
                        {paidReferred} of {totalReferred} paid
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Directory Control Bar */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800/80">
                <div>
                  <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Share2 size={18} className="text-cyan-400" /> Referral Program Directory
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Track which candidates have referred others and drill down to view their referred signups.</p>
                </div>
                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search by Name, Email, or Code..."
                    value={referralSearch}
                    onChange={(e) => setReferralSearch(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-450 uppercase font-black tracking-wider">
                      <th className="py-3 px-4">Referrer Details</th>
                      <th className="py-3 px-4">Referral Code</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Referred By</th>
                      <th className="py-3 px-4 text-center">Registrations</th>
                      <th className="py-3 px-4 text-center">Paid Conversions</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {(() => {
                      const filtered = users.filter(u => {
                        if (!referralSearch) return true;
                        const s = referralSearch.toLowerCase();
                        return (
                          u.name.toLowerCase().includes(s) ||
                          u.email.toLowerCase().includes(s) ||
                          (u.referralCode && u.referralCode.toLowerCase().includes(s))
                        );
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                              No referrers found matching search criteria.
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map((referrer) => {
                        const isExpanded = expandedReferrerId === referrer.id;
                        
                        // Find referred students
                        const referredStudents = users.filter(
                          student => student.referredBy && student.referredBy.trim().toUpperCase() === referrer.referralCode?.trim().toUpperCase()
                        );
                        
                        const paidCount = referredStudents.filter(
                          student => student.payments?.some((p: any) => p.status === 'VERIFIED')
                        ).length;

                        return (
                          <Fragment key={referrer.id}>
                            <tr className="hover:bg-slate-900/40 text-slate-300 transition">
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-white">{referrer.name}</div>
                                <div className="text-[11px] text-slate-500 font-mono">{referrer.email}</div>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-[11px] text-cyan-400">
                                {referrer.referralCode || 'N/A'}
                              </td>
                              <td className="py-3.5 px-4">
                                {referrer.referralSuccess ? (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                                    ✓ SUCCESSFUL
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase bg-slate-900 text-slate-500 border border-slate-800">
                                    IN PROGRESS
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                {referrer.referredBy ? (
                                  <span className="font-mono text-[11px] text-slate-450 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                    {referrer.referredBy}
                                  </span>
                                ) : (
                                  <span className="text-slate-650 italic">Direct Signup</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-center font-bold text-white">
                                {referredStudents.length} / 15
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  paidCount >= 5 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : paidCount > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-500'
                                }`}>
                                  {paidCount} / 5 paid
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => setExpandedReferrerId(isExpanded ? null : referrer.id)}
                                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-bold uppercase transition"
                                >
                                  {isExpanded ? 'Hide Details' : 'View Details'}
                                </button>
                              </td>
                            </tr>
                            
                            {/* Expandable sub-table for referred students */}
                            {isExpanded && (
                              <tr>
                                <td colSpan={6} className="bg-slate-950/40 p-4 border-l-2 border-cyan-500">
                                  <div className="space-y-3 pl-4">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                                      Students Referred by {referrer.name} ({referredStudents.length})
                                    </h4>
                                    
                                    {referredStudents.length === 0 ? (
                                      <p className="text-[11px] text-slate-500 italic">This user has not referred any students yet.</p>
                                    ) : (
                                      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
                                        <table className="w-full text-left text-[11px] text-slate-350">
                                          <thead>
                                            <tr className="border-b border-slate-800 text-slate-500 uppercase font-bold text-[11px] tracking-wider bg-slate-900/30">
                                              <th className="py-2 px-3">Student Name</th>
                                              <th className="py-2 px-3">Email Address</th>
                                              <th className="py-2 px-3">Registration Date</th>
                                              <th className="py-2 px-3">Enrolled Course Tracks</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-850">
                                            {referredStudents.map((student) => (
                                              <tr key={student.id} className="hover:bg-slate-900/30">
                                                <td className="py-2 px-3 font-semibold text-slate-200">{student.name}</td>
                                                <td className="py-2 px-3 font-mono">{student.email}</td>
                                                <td className="py-2 px-3">
                                                  {student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                  }) : 'N/A'}
                                                </td>
                                                <td className="py-2 px-3">
                                                  <div className="flex flex-wrap gap-1">
                                                    {(() => {
                                                      const courseMap = new Map<string, { progress?: number; paid?: boolean; pending?: boolean }>();
                                                      
                                                      if (student.progresses) {
                                                        student.progresses.forEach((p: any) => {
                                                          courseMap.set(p.courseId, { progress: p.progress });
                                                        });
                                                      }
                                                      
                                                      if (student.payments) {
                                                        student.payments.forEach((py: any) => {
                                                          const existing = courseMap.get(py.courseId) || {};
                                                          if (py.status === 'VERIFIED') {
                                                            courseMap.set(py.courseId, { ...existing, paid: true });
                                                          } else if (py.status === 'PENDING_VERIFICATION') {
                                                            courseMap.set(py.courseId, { ...existing, pending: true });
                                                          }
                                                        });
                                                      }
                                                      
                                                      if (courseMap.size === 0) {
                                                        return <span className="text-slate-650 italic text-[11px]">Not Enrolled</span>;
                                                      }
                                                      
                                                      return Array.from(courseMap.entries()).map(([courseId, info]) => {
                                                        let badgeText = `${courseId}`;
                                                        let badgeStyle = "border-blue-500/20 bg-blue-500/5 text-blue-400";
                                                        
                                                        if (info.progress !== undefined) badgeText += ` (${info.progress}%)`;
                                                        else badgeText += ` (0%)`;
                                                        
                                                        if (info.paid) {
                                                          badgeText += ` [Paid]`;
                                                          badgeStyle = "border-emerald-500/25 bg-emerald-500/10 text-emerald-400";
                                                        } else if (info.pending) {
                                                          badgeText += ` [Pending]`;
                                                          badgeStyle = "border-amber-500/25 bg-amber-500/10 text-amber-400";
                                                        }
                                                        
                                                        return (
                                                          <span
                                                            key={courseId}
                                                            className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[11px] font-bold uppercase tracking-wider ${badgeStyle}`}
                                                          >
                                                            {badgeText}
                                                          </span>
                                                        );
                                                      });
                                                    })()}
                                                  </div>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Gorgeous Side-by-Side Live WYSIWYG Editor Modal (Issue #8) */}
      <AnimatePresence>
        {editingTopic && (
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
                    onClick={() => setShowLivePreview(!showLivePreview)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition flex items-center gap-1.5 ${
                      showLivePreview 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                        : 'bg-slate-800 border border-slate-700 text-slate-400'
                    }`}
                  >
                    <Eye size={12} /> {showLivePreview ? 'Hide Live Preview' : 'Show Live Preview'}
                  </button>
                  <button 
                    onClick={() => setEditingTopic(null)}
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
                      onChange={(e) => setEditingTopic({ ...editingTopic, title: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>

                  {/* Topic Main Content text */}
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-bold text-slate-400">Topic Content Body (Rich Markdown Support)</label>
                    <textarea 
                      rows={8}
                      required
                      placeholder="Enter detailed technical explanations for students..."
                      value={editingTopic.text}
                      onChange={(e) => setEditingTopic({ ...editingTopic, text: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition font-sans leading-relaxed"
                    />
                  </div>

                  {/* Inline Code Snippet */}
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-bold text-slate-400">Compiler Code Snippet (Optional)</label>
                    <textarea 
                      rows={4}
                      placeholder="#include <stdio.h>\n..."
                      value={editingTopic.code || ''}
                      onChange={(e) => setEditingTopic({ ...editingTopic, code: e.target.value })}
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
                      onChange={(e) => setEditingTopic({ ...editingTopic, note: e.target.value })}
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
                        onChange={(e) => setMockAssetUrl(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition"
                      />
                      <button 
                        type="button"
                        disabled={uploadingAsset || !mockAssetUrl}
                        onClick={handleMockAssetUpload}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-cyan-400 hover:text-white rounded-lg text-[11px] font-bold uppercase transition"
                      >
                        {uploadingAsset ? 'Mounting...' : 'Mount Asset'}
                      </button>
                    </div>
                  </div>

                </div>

                {/* WYSIWYG Side-by-Side Premium Live Preview Pane (Issue #8) */}
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
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{editingTopic.text || 'Study material description placeholder.'}</p>
                      
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
                  onClick={() => setEditingTopic(null)}
                  className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSaveTopic}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-cyan-500/10 flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <Save size={14} /> Commit & Publish Block
                </button>
              </div>

            </motion.div>
          </div>
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
                  <label className="text-[11px] uppercase font-bold text-slate-400">Question Statement</label>
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
                  <label className="text-[11px] uppercase font-bold text-slate-400 block mb-1">Answer Options</label>
                  {editingQuiz.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex gap-2 items-center">
                      <span className="text-[11px] font-black text-slate-600 w-4 font-mono">[{String.fromCharCode(65 + oIdx)}]</span>
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
                  <label className="text-[11px] uppercase font-bold text-slate-400">Correct Answer (Must match correct Option string exactly)</label>
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

      {/* Create New Learning Track (Course) Modal */}
      <AnimatePresence>
        {showAddCourseModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 text-left space-y-5"
            >
              <div className="flex items-center gap-2 text-cyan-400 pb-2 border-b border-slate-900">
                <BookOpen size={18} />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  Create New Course Track
                </h3>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-4">
                
                {/* Course ID */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-400">Course Identifier (ID)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. CADDED_Mech"
                    value={newCourseId}
                    onChange={(e) => setNewCourseId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-cyan-500 transition font-bold"
                  />
                  <p className="text-[11px] text-slate-500 leading-normal">This should be unique, alphanumeric and without spaces (e.g. `IoT`, `WebDesign`).</p>
                </div>

                {/* Course Title */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-400">Course Title</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. CADDED Software (Mechanical)"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* Course Description */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-400">Course Description</label>
                  <textarea 
                    required
                    placeholder="Provide a comprehensive description of the curriculum learning outcomes..."
                    value={newCourseDesc}
                    onChange={(e) => setNewCourseDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-cyan-500 transition resize-none leading-relaxed"
                  />
                </div>

                {/* Course Price */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-400">Course Registration Price (INR)</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={newCoursePrice}
                    onChange={(e) => setNewCoursePrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition font-bold"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-900">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAddCourseModal(false);
                      setNewCourseId('');
                      setNewCourseTitle('');
                      setNewCourseDesc('');
                      setNewCoursePrice(999);
                    }}
                    className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-[0.98]"
                  >
                    Create Track
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create New Week Module Modal */}
      <AnimatePresence>
        {showAddModuleModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 text-left space-y-5"
            >
              <div className="flex items-center gap-2 text-cyan-400 pb-2 border-b border-slate-900">
                <BookOpen size={18} />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  Create Week {newModuleWeek} Module
                </h3>
              </div>

              <form onSubmit={handleCreateModule} className="space-y-4">
                
                {/* Module Week Number */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-400">Week Number</label>
                  <input 
                    type="number"
                    required
                    min={1}
                    value={newModuleWeek}
                    onChange={(e) => setNewModuleWeek(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition font-bold"
                  />
                </div>

                {/* Module Title */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-400">Module Title</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. AutoCAD 2D Drafting & Interface"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* Module Description */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-slate-400">Module Description</label>
                  <textarea 
                    required
                    placeholder="Brief description of the topics covered in this week..."
                    value={newModuleDesc}
                    onChange={(e) => setNewModuleDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-cyan-500 transition resize-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-900">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAddModuleModal(false);
                      setNewModuleCourseId('');
                      setNewModuleWeek(1);
                      setNewModuleTitle('');
                      setNewModuleDesc('');
                    }}
                    className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-[0.98]"
                  >
                    Create Module
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;
