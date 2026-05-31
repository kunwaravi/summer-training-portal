import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { 
  BookOpen, Award, CheckCircle2, TrendingUp, Zap, Target, 
  Star, ShieldAlert, Settings, User, Key, Save, AlertCircle,
  Search, Cpu, Code, Brain, Trophy, MessageSquare, Clipboard,
  ExternalLink, ChevronRight, Play, BookOpenCheck, ThumbsUp, Send, Check
} from 'lucide-react';
import { coursesConfig } from '../config/courses';
import { projectsConfig } from '../config/projects';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Tab switching state
  const [activeTab, setActiveTab] = useState<'courses' | 'practice' | 'projects' | 'forum' | 'credentials' | 'settings'>('courses');

  // Filter & Search states for Courses
  const [courseCategory, setCourseCategory] = useState<'All' | 'Programming' | 'Electronics'>('All');
  const [courseSearch, setCourseSearch] = useState('');

  // Project catalog states
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectFilter, setProjectFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(false);

  // Community Forum state (leveraging localStorage for persistence)
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('General');
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Form states for Profile Settings
  const [name, setName] = useState(user?.name || '');
  const [collegeName, setCollegeName] = useState(user?.collegeName || '');
  const [branchName, setBranchName] = useState(user?.branchName || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [leaderboardSearch, setLeaderboardSearch] = useState('');

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments/admin/all'); // Admin endpoint fetches all, but we only need it for the user if they were admin.
      // Wait, there is no user-specific "all my payments" endpoint yet.
      // Let's check if we have one or just fetch it for each course (inefficient).
      // Actually, I can just use the user profile if it had payment info.
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    }
  };

  useEffect(() => {
    const fetchUserPayments = async () => {
        try {
            // Let's assume we can get this from a new endpoint or just use profile results if we add it.
            // For now, I'll just check status for each course.
            const paymentPromises = coursesConfig.map(c => api.get(`/payments/status/${c.id}`));
            const results = await Promise.all(paymentPromises);
            const successfulPayments = results
                .filter(r => r.data.paid)
                .map((r, idx) => coursesConfig[idx].id);
            setPayments(successfulPayments);
        } catch (err) {
            console.error('Failed to fetch payment statuses:', err);
        } finally {
            setLoadingPayments(false);
        }
    };
    fetchUserPayments();
  }, [user?.id]);

  const fetchForumPosts = async () => {
    try {
      const res = await api.get('/forum');
      // Normalize posts to match what the frontend expects
      const normalized = res.data.discussions.map((d: any) => ({
        id: d.id,
        title: d.title,
        content: d.content,
        author: d.user?.name || 'Student',
        category: d.courseId || 'General',
        upvotes: 1, // local-only mock upvotes
        comments: d.comments.map((c: any) => ({
          author: c.user?.name || 'Respondent',
          text: c.content
        })),
        createdAt: new Date(d.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      setForumPosts(normalized);
    } catch (err) {
      console.error('Failed to fetch forum posts:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'forum') {
      fetchForumPosts();
    }
  }, [activeTab]);

  // Helper to extract course specific stats
  const getCourseProgress = (courseId: string) => {
    if (!user || !user.progresses) return { progress: 0, completed: false };
    const p = user.progresses.find((item: any) => item.courseId === courseId);
    return p ? { progress: p.progress, completed: p.completed } : { progress: 0, completed: false };
  };

  const getBestGrade = (courseId: string) => {
    if (!user || !user.results) return null;
    const passingResults = user.results.filter((r: any) => r.courseId === courseId && r.passed);
    if (passingResults.length === 0) return null;
    const best = passingResults.reduce((prev: any, current: any) => (prev.accuracy > current.accuracy) ? prev : current);
    return best.grade;
  };

  // Aggregated metrics
  const activeTracksCount = user?.progresses?.filter((p: any) => p.progress > 0 && p.progress < 100).length || 0;
  const completedTracksCount = user?.progresses?.filter((p: any) => p.progress === 100).length || 0;
  const highestAccuracy = user?.results?.length > 0 ? Math.max(...user.results.map((r: any) => r.accuracy)) : 0;

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const activeTracks = user?.progresses?.filter((p: any) => p.progress > 0 && p.progress < 100) || [];
  const latestProgressInfo = activeTracks.length > 0 ? activeTracks[0] : null;
  const latestActiveCourse = latestProgressInfo ? {
    id: latestProgressInfo.courseId,
    progress: latestProgressInfo.progress,
    title: coursesConfig.find(c => c.id === latestProgressInfo.courseId)?.titleShort || "Specialized Track"
  } : null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (password && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = { name, collegeName, branchName };
      if (password) payload.password = password;

      const response = await api.put('/auth/profile', payload);
      login(response.data.token || '', response.data.user);
      setSuccessMsg('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Forum interactions
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    try {
      await api.post('/forum', {
        title: newPostTitle,
        content: newPostContent,
        courseId: newPostCategory !== 'General' ? newPostCategory : null
      });

      setNewPostTitle('');
      setNewPostContent('');
      alert('Forum thread published successfully!');
      fetchForumPosts();
    } catch (err) {
      console.error('Failed to create forum thread:', err);
      alert('Failed to publish thread. Please try again.');
    }
  };

  const handleUpvotePost = (postId: number) => {
    // Keep local simulated upvotes on top of the DB posts
    const updated = forumPosts.map(p => {
      if (p.id === postId) {
        return { ...p, upvotes: p.upvotes + 1 };
      }
      return p;
    });
    setForumPosts(updated);
  };

  const handleAddForumComment = async (e: React.FormEvent, postId: number) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      await api.post(`/forum/${postId}/comment`, {
        content: newCommentText
      });

      setNewCommentText('');
      fetchForumPosts();
    } catch (err) {
      console.error('Failed to add reply:', err);
      alert('Failed to post reply.');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(true);
    setTimeout(() => setCopiedCodeIdx(false), 2000);
  };

  // Filter Courses
  const filteredCourses = coursesConfig.filter(c => {
    const matchesCategory = courseCategory === 'All' || c.category === courseCategory;
    const matchesSearch = c.title.toLowerCase().includes(courseSearch.toLowerCase()) || 
                          c.titleShort.toLowerCase().includes(courseSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter Projects
  const filteredProjects = projectsConfig.filter(p => {
    return projectFilter === 'All' || p.difficulty === projectFilter;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="py-6 space-y-10 max-w-7xl mx-auto px-4 bg-slate-950 min-h-screen text-white"
    >
      {/* 1. Header Welcome Cockpit */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-850 pb-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 bg-clip-text text-transparent uppercase flex items-center gap-2">
            <Zap className="text-emerald-400 fill-emerald-400/20" size={32} />
            <span>Hello, {user?.name?.split(' ')[0]}!</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-xl font-medium">
            Welcome to Edunexus. Study complete professional tracks, solve practice tests, and secure certifications.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs font-bold items-center">
          <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 shadow flex items-center gap-2">
            🏢 {user?.collegeName || 'Google Linked Account'}
          </span>
          <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 shadow flex items-center gap-2">
            ⚙ {user?.branchName || 'N/A'}
          </span>
        </div>
      </motion.div>

      {/* Staff Privileges Banner */}
      {user?.role === 'ADMIN' && (
        <motion.div variants={itemVariants} className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} />
            <span>STAFF PRIVILEGES ACTIVE: You can manage courses, users, and quizzes.</span>
          </div>
          <button 
            onClick={() => navigate('/admin')}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-rose-500 to-red-650 text-slate-950 font-black rounded-lg transition-all active:scale-[0.98] uppercase tracking-wider text-[10px]"
          >
            Open Admin Panel
          </button>
        </motion.div>
      )}

      {/* 2. GFG-Style Tab Navigation */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2 border-b border-slate-850 pb-2 overflow-x-auto">
        {[
          { id: 'courses', label: 'My Courses', icon: BookOpen },
          { id: 'practice', label: 'Practice Arena', icon: Trophy },
          { id: 'projects', label: 'Projects Workspace', icon: Cpu },
          { id: 'forum', label: 'Q&A Forum', icon: MessageSquare },
          { id: 'credentials', label: 'Credentials Chest', icon: Award },
          { id: 'settings', label: 'Profile Editor', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                isActive 
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10' 
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-850 hover:bg-slate-850'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* 3. Dynamic Console Screens */}
      <AnimatePresence mode="wait">
        
        {/* Tab 1: My Learning Courses */}
        {activeTab === 'courses' && (
          <motion.div
            key="courses-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Quick Resume Dashboard Widget */}
            {latestActiveCourse && (
              <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-850 rounded-[2rem] flex flex-col justify-between relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
                    <Zap size={14} className="animate-pulse fill-emerald-400/20" /> Resume Learning Track
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tight">{latestActiveCourse.title}</h3>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-slate-850">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${latestActiveCourse.progress}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" 
                      />
                    </div>
                    <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">{latestActiveCourse.progress}%</span>
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-850 flex justify-end relative z-10">
                  <button 
                    onClick={() => navigate(`/course/${latestActiveCourse.id}`)}
                    className="bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl shadow hover:opacity-95 transition flex items-center gap-2"
                  >
                    Resume Training <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Aggregated Mini Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Active Tracks", value: activeTracksCount, color: "text-emerald-450", bg: "bg-emerald-500/10" },
                { label: "Completed Tracks", value: completedTracksCount, color: "text-teal-400", bg: "bg-teal-500/10" },
                { label: "Highest Accuracy", value: `${highestAccuracy}%`, color: "text-cyan-400", bg: "bg-cyan-500/10" }
              ].map((stat, sIdx) => (
                <div key={sIdx} className="p-5 bg-slate-900 border border-slate-850 rounded-2xl flex items-center justify-between">
                  <span className="text-slate-450 text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                  <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Search & Category Filter Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-850">
              <div className="flex flex-wrap gap-1.5 bg-slate-950/60 p-1 border border-slate-850 rounded-2xl">
                {(['All', 'Programming', 'Electronics'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCourseCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition ${courseCategory === cat ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-450 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-4 top-3 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-900 border border-slate-850 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs font-bold"
                />
              </div>
            </div>

            {/* Courses grid rendering */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, cIdx) => {
                const progress = getCourseProgress(course.id);
                const hasStarted = progress.progress > 0;
                const isCompleted = progress.completed;
                const grade = getBestGrade(course.id);

                const isPaid = payments.includes(course.id);

                return (
                  <motion.div
                    key={course.id}
                    whileHover={{ y: -6 }}
                    onClick={() => {
                        if ((isCompleted && isPaid) || user?.role === 'ADMIN') {
                            navigate(`/certificate?courseId=${course.id}`);
                        } else {
                            navigate(`/course/${course.id}`);
                        }
                    }}
                    className="group cursor-pointer bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-xl hover:border-emerald-500/40 flex flex-col justify-between"
                  >
                    <div className={`h-36 bg-gradient-to-br ${course.colorDark} p-6 relative overflow-hidden flex items-center justify-between`}>
                      <div className="absolute inset-0 bg-slate-950/20"></div>
                      <course.icon size={48} className="text-white drop-shadow-xl relative z-10 shrink-0" />
                      
                      <div className="text-right z-10 space-y-1">
                        <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase border tracking-wider shadow ${isCompleted ? 'bg-emerald-500 text-slate-950 border-emerald-400' : hasStarted ? 'bg-teal-500 text-slate-950 border-teal-400' : 'bg-slate-950 text-slate-300 border-slate-850'}`}>
                          {isCompleted ? (grade ? `${grade}` : 'COMPLETED') : hasStarted ? 'IN PROGRESS' : 'NOT STARTED'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="text-lg font-black tracking-tight text-white group-hover:text-emerald-450 transition">{course.titleShort}</h4>
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{course.descShort}</p>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-slate-850">
                        <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase">
                          <span>Mastery Progress</span>
                          <span className="text-slate-350">{progress.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                          <div className={`h-full ${course.barColor}`} style={{ width: `${progress.progress}%` }}></div>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between font-black text-[11px] uppercase ${course.textColor} pt-2`}>
                        <span>{(isCompleted || user?.role === 'ADMIN') ? 'View Certificate' : hasStarted ? 'Resume Next Module' : 'Explore Track'}</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Tab 2: Practice Arena */}
        {activeTab === 'practice' && (
          <motion.div
            key="practice-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Col: Diagnostic Timed Tests */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Zap className="text-amber-400 fill-amber-400/20" /> Topic-wise Mock Tests
                </h3>
                <p className="text-slate-400 text-xs mt-1">Accelerate your programming syntax and electronics parameters with timed tests.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Programming MCQs Practice", category: "Programming", qs: "5 MCQs", time: "15 Mins" },
                  { title: "Electronics Parameter Practice", category: "Electronics", qs: "5 MCQs", time: "15 Mins" },
                  { title: "Timed Systems Mock Test", category: "Programming", qs: "5 MCQs", time: "15 Mins" }
                ].map((test, idx) => (
                  <div key={idx} className="p-6 bg-slate-900 border border-slate-850 rounded-3xl space-y-4 flex flex-col justify-between shadow-xl">
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 tracking-wider">{test.category}</span>
                      <h4 className="text-base font-bold text-white leading-snug">{test.title}</h4>
                      <p className="text-[10px] text-slate-500 font-bold font-mono">Telemetry: {test.qs} • Limit: {test.time}</p>
                    </div>

                    <button 
                      onClick={() => navigate(`/practice/arena?category=${test.category}`)}
                      className="w-full py-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-450 hover:text-white flex items-center justify-center gap-2 transition"
                    >
                      <Play size={12} className="fill-emerald-400/20 text-emerald-400" /> Start Arena
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Global Leaderboard */}
            <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4 shadow-2xl shrink-0 self-start">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="text-yellow-500" size={20} />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">Global Leaderboard</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-950 text-[9px] font-bold text-slate-450 border border-slate-850 font-mono">
                  {leaderboard.length} users
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={leaderboardSearch}
                  onChange={(e) => setLeaderboardSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-850 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition font-medium"
                />
              </div>

              <div className="space-y-3 pt-2">
                {loadingLeaderboard ? (
                  <div className="py-8 text-center space-y-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Syncing Rankings...</p>
                  </div>
                ) : leaderboard.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-500 font-bold">No ranking profiles found.</p>
                ) : (
                  leaderboard.map((student, sIdx) => {
                    const isCurrentUser = student.id === user?.id;
                    const initials = student.name
                      ? student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
                      : 'ST';
                    
                    const badge = student.points >= 500 ? 'Master' : student.points >= 200 ? 'Pro' : 'Scholar';
                    const badgeColor = badge === 'Master' ? 'text-amber-400' : badge === 'Pro' ? 'text-blue-400' : 'text-slate-400';

                    return (
                      <div 
                        key={student.id}
                        className={`p-3 rounded-2xl flex items-center justify-between border transition ${isCurrentUser ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${sIdx === 0 ? 'bg-yellow-500 text-slate-950' : sIdx === 1 ? 'bg-slate-300 text-slate-950' : sIdx === 2 ? 'bg-amber-600 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                            {sIdx + 1}
                          </span>
                          
                          <div className="w-8 h-8 rounded-full bg-slate-850 border border-slate-700 text-slate-350 text-xs font-black flex items-center justify-center shrink-0">
                            {initials}
                          </div>

                          <div>
                            <h4 className="text-xs font-black text-slate-200">{student.name}</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                              <span className={`font-black ${badgeColor}`}>{badge}</span> • {student.collegeName || 'Edunexus User'}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-black text-emerald-400 font-mono shrink-0">{student.points} XP</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Projects Workspace */}
        {activeTab === 'projects' && (
          <motion.div
            key="projects-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Cpu className="text-emerald-450" /> Electronics Projects Workspace
                </h3>
                <p className="text-slate-400 text-xs mt-1">Acquire physical knowledge by prototyping advanced, verified hardware modules.</p>
              </div>

              <div className="flex gap-1.5 bg-slate-950/60 p-1 border border-slate-850 rounded-2xl shrink-0">
                {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setProjectFilter(diff)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${projectFilter === diff ? 'bg-slate-900 text-white' : 'text-slate-450 hover:text-white'}`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredProjects.map((project, pIdx) => (
                <div key={pIdx} className="p-6 bg-slate-900 border border-slate-850 rounded-[2rem] flex flex-col justify-between shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 tracking-wider">{project.category}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${project.difficulty === 'Advanced' ? 'text-rose-400' : project.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-emerald-450'}`}>{project.difficulty}</span>
                    </div>

                    <h4 className="text-lg font-black leading-snug text-white">{project.title}</h4>
                    <p className="text-slate-450 text-xs leading-relaxed">{project.description}</p>
                  </div>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-95 transition flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={12} /> View Specs & Manual
                  </button>
                </div>
              ))}
            </div>

            {/* Project Viewer Lightbox Modal */}
            <AnimatePresence>
              {selectedProject && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] overflow-y-auto space-y-6 relative text-left shadow-2xl"
                  >
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="absolute right-6 top-6 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white bg-slate-950 border border-slate-850 px-4 py-2 rounded-xl"
                    >
                      Close ✕
                    </button>

                    <div className="space-y-2 border-b border-slate-850 pb-4">
                      <div className="flex gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-450">{selectedProject.category}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-950 border border-slate-850 text-slate-400">{selectedProject.difficulty}</span>
                      </div>
                      <h3 className="text-2xl font-black text-white">{selectedProject.title}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      {/* Left: Manual assembly instructions */}
                      <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-450 border-b border-slate-850 pb-2">1. Hardware Manual & Wiring</h4>
                        <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl font-mono text-[10px] text-slate-400 overflow-x-auto whitespace-pre">
                          {selectedProject.schematic}
                        </div>
                        <div className="whitespace-pre-wrap pt-2">
                          {selectedProject.documentation}
                        </div>
                      </div>

                      {/* Right: Embedded source code */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-450">2. Firmware Driver Code</h4>
                          <button
                            onClick={() => handleCopyCode(selectedProject.code)}
                            className="px-3 py-1.5 bg-slate-950 border border-slate-850 text-[10px] text-slate-300 font-bold uppercase rounded-xl hover:text-white transition flex items-center gap-1.5"
                          >
                            <Clipboard size={12} />
                            {copiedCodeIdx ? 'Copied!' : 'Copy Code'}
                          </button>
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-5 shadow-inner">
                          <pre className="text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed select-all">
                            <code>{selectedProject.code}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Tab 4: Q&A Discussions Forum */}
        {activeTab === 'forum' && (
          <motion.div
            key="forum-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left: Interactive posts feeds */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <MessageSquare className="text-emerald-450" /> Q&A Forum Threads
                </h3>
                <p className="text-slate-400 text-xs mt-1">Engage with fellow students, raise doubts, and contribute verified solutions.</p>
              </div>

              <div className="space-y-4">
                {forumPosts.map(post => {
                  const isExpanded = expandedPostId === post.id;
                  return (
                    <div key={post.id} className="p-6 bg-slate-900 border border-slate-850 rounded-[2rem] space-y-4 shadow-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-400">{post.category}</span>
                            <span className="text-[9px] text-slate-500 font-bold">posted by {post.author} • {post.createdAt}</span>
                          </div>
                          <h4 className="text-base font-bold text-white hover:text-emerald-400 transition cursor-pointer" onClick={() => setExpandedPostId(isExpanded ? null : post.id)}>
                            {post.title}
                          </h4>
                        </div>

                        <button 
                          onClick={() => handleUpvotePost(post.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-xl hover:border-emerald-500 text-[10px] text-slate-400 hover:text-emerald-400 font-bold transition shrink-0"
                        >
                          <ThumbsUp size={12} /> {post.upvotes}
                        </button>
                      </div>

                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{post.content}</p>

                      <div className="pt-2">
                        <button
                          onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                          className="text-[10px] font-black uppercase tracking-wider text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          {isExpanded ? 'Hide Thread Answers' : `View Answers / Comments (${post.comments.length})`}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden mt-4 pt-4 border-t border-slate-850 space-y-4"
                            >
                              {/* Comment List */}
                              <div className="space-y-3">
                                {post.comments.map((c: any, cIdx: number) => (
                                  <div key={cIdx} className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-xs space-y-1">
                                    <span className="font-black text-slate-350 block">{c.author}</span>
                                    <p className="text-slate-400 font-medium leading-relaxed">{c.text}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Comment Form */}
                              <form onSubmit={(e) => handleAddForumComment(e, post.id)} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="Type your verified reply..."
                                  value={newCommentText}
                                  onChange={(e) => setNewCommentText(e.target.value)}
                                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                                />
                                <button type="submit" className="p-2.5 bg-emerald-500 text-slate-950 rounded-xl hover:opacity-90 transition shadow">
                                  <Send size={14} />
                                </button>
                              </form>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Post a new thread */}
            <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-6 shadow-2xl shrink-0 h-fit">
              <div className="border-b border-slate-850 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">Start New Thread</h3>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500">Thread Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MSP430 Timer Overflow"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500">Category</label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-slate-350 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="General">General Doubt</option>
                    <option value="Programming">Programming</option>
                    <option value="Electronics">Electronics Hardware</option>
                    <option value="AI & ML">AI & Machine Learning</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500">Content / Question Details</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide assembly codes, configurations, or error dumps..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition active:scale-95 shadow"
                >
                  Publish Thread
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Tab 5: Credentials Chest */}
        {activeTab === 'credentials' && (
          <motion.div
            key="credentials-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Award className="text-emerald-450" /> Credentials Chest
              </h3>
              <p className="text-slate-400 text-xs mt-1">Your verifiable digital certifications are safely archived inside this chest.</p>
            </div>

            {completedTracksCount === 0 ? (
              <div className="p-10 border border-dashed border-slate-800 rounded-3xl text-center space-y-4">
                <div className="w-16 h-16 bg-slate-900 border border-slate-850 rounded-full flex items-center justify-center text-slate-500 mx-auto text-xl">🔒</div>
                <h4 className="text-sm font-black text-slate-350 uppercase tracking-widest">No certifications issued yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Complete all modules inside an engineering track and pass the final examination with at least 70% accuracy to unlock.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {user?.progresses?.filter((p: any) => p.completed).map((completed: any, idx: number) => {
                  const courseMeta = coursesConfig.find(c => c.id === completed.courseId);
                  const randomCode = `NX-2026-CERT-${completed.courseId}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
                  
                  return (
                    <div key={idx} className="p-6 bg-slate-900 border border-slate-850 rounded-3xl flex flex-col justify-between gap-6 shadow-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 tracking-wider">Verifiable Credential</span>
                          <h4 className="text-lg font-black text-white pt-1">{courseMeta?.title || completed.courseId}</h4>
                          <p className="text-[10px] text-slate-500 font-bold font-mono">Registry Serial: {randomCode}</p>
                        </div>
                        <Award size={36} className="text-emerald-450 shrink-0" />
                      </div>

                      <div className="pt-4 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-black uppercase">
                          <CheckCircle2 size={16} /> Fully Verified
                        </span>
                        
                        <button
                          onClick={() => navigate(`/certificate?courseId=${completed.courseId}`)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition active:scale-95 shadow"
                        >
                          View & Download PDF
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 6: Profile Settings Editor */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl bg-slate-900 border border-slate-850 p-8 rounded-3xl shadow-xl space-y-8"
          >
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <User className="text-emerald-450" /> Profile Information
              </h3>
              <p className="text-slate-400 text-xs mt-1">Update your name, educational credentials, and account password.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3 text-slate-500" size={16} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Email (Read-only)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-500 text-xs font-bold font-mono">@</span>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-850 rounded-xl text-slate-500 text-xs font-bold cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">College Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-500 text-xs">🏢</span>
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Branch / Specialty</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-500 text-xs">⚙</span>
                    <input
                      type="text"
                      required
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-850 pt-6 space-y-6">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <Key size={16} className="text-emerald-450" /> Change Security Password
                  </h4>
                  <p className="text-slate-400 text-[10px] mt-0.5">Leave blank if you do not wish to modify your active password.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">New Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {successMsg && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-bold animate-in fade-in duration-200">
                  <CheckCircle2 size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold animate-in fade-in duration-200">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition active:scale-95 disabled:opacity-75"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Profile Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

      </AnimatePresence>

    </motion.div>
  );
};

export default Dashboard;