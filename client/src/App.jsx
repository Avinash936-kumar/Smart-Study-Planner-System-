import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { FullPageLoader } from './components/LoadingSpinner';
import Sidebar from './components/Sidebar';
import { Toaster } from 'react-hot-toast';
import { requestNotificationPermission } from './services/notificationService';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import SubjectsPage from './pages/SubjectsPage';
import GoalsPage from './pages/GoalsPage';
import ExamsPage from './pages/ExamsPage';
import RoutinePage from './pages/RoutinePage';
import FocusPage from './pages/FocusPage';
import NotesPage from './pages/NotesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';

// V2 OS Pages
import AttendancePage from './pages/AttendancePage';
import SyllabusPage from './pages/SyllabusPage';
import RevisionPage from './pages/RevisionPage';
import ResourcesPage from './pages/ResourcesPage';
import BudgetPage from './pages/BudgetPage';
import GroupsPage from './pages/GroupsPage';
import CalendarPage from './pages/CalendarPage';

import Navbar from './components/Navbar';

import AiChatWidget from './components/AiChatWidget';

// Protected route wrapper
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-950">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Navbar />
        <Outlet />
        <AiChatWidget />
      </div>
    </div>
  );
};

// Guest route wrapper (redirect to dashboard if already logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <FullPageLoader />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
};

const App = () => {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<GuestRoute><LandingPage /></GuestRoute>} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/routine" element={<RoutinePage />} />
        <Route path="/focus" element={<FocusPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* V2 OS Routes */}
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/syllabus" element={<SyllabusPage />} />
        <Route path="/revisions" element={<RevisionPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
