import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { ThemeProvider } from './context/ThemeContext';
import React, { Suspense } from 'react';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPassword from './pages/ResetPassword';
import Verify from './pages/Verify';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const CourseDetail = React.lazy(() => import('./pages/CourseDetail'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const Certificate = React.lazy(() => import('./pages/Certificate'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const PracticeArena = React.lazy(() => import('./pages/PracticeArena'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Refund = React.lazy(() => import('./pages/Refund'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
import Navbar from './components/Navbar';
import FloatingSupportWidget from './components/atoms/FloatingSupportWidget';
import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-20 text-slate-400">Verifying security clearances...</div>;
  if (!user || user.role !== 'ADMIN') return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Navbar />
      <FloatingSupportWidget />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage mode="login" />} />
            <Route path="/register" element={<LoginPage mode="register" />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
            <Route path="/quiz/:courseId/:week" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/practice/arena" element={<ProtectedRoute><PracticeArena /></ProtectedRoute>} />
            <Route path="/certificate" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </div>
      
      {/* Premium Footer */}
      <footer className="bg-slate-950/60 border-t border-slate-900/60 py-6 no-print">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p className="text-slate-400">© 2026 Edunexus Automation Labs. All rights reserved.</p>
            <p className="text-[10px] text-slate-600">Technical Support: Available via WhatsApp & Telegram Support Groups</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center sm:justify-end">
            <Link to="/about" className="hover:text-slate-350 transition-colors">About Us</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-350 transition-colors">Contact Us</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-350 transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-slate-350 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/refund" className="hover:text-slate-350 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <ThemeProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ThemeProvider>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
