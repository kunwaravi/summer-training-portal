import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import React, { Suspense } from 'react';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPassword from './pages/ResetPassword';
import Verify from './pages/Verify';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const CourseDetail = React.lazy(() => import('./pages/CourseDetail'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const Certificate = React.lazy(() => import('./pages/Certificate'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const PracticeArena = React.lazy(() => import('./pages/PracticeArena'));
import Navbar from './components/Navbar';
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
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
            <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/practice/arena" element={<ProtectedRoute><PracticeArena /></ProtectedRoute>} />
            <Route path="/certificate" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
