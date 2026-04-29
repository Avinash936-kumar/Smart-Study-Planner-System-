import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  HiChartPie, HiClipboardDocumentList, HiBookOpen, 
  HiFlag, HiAcademicCap, HiCalendarDays, HiBolt, HiDocumentText,
  HiClipboardDocumentCheck, HiClock, HiArrowUpTray, HiCurrencyDollar, HiUserGroup, HiCalendar, HiUserCircle, HiArrowRightOnRectangle, HiSparkles, HiChevronLeft, HiChevronRight, HiHome
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard', icon: HiChartPie, label: 'Dashboard' },
  { path: '/tasks', icon: HiClipboardDocumentList, label: 'Tasks' },
  { path: '/calendar', icon: HiCalendar, label: 'Calendar' },
  { path: '/subjects', icon: HiBookOpen, label: 'Subjects' },
  { path: '/attendance', icon: HiClipboardDocumentCheck, label: 'Attendance' },
  { path: '/syllabus', icon: HiBookOpen, label: 'Syllabus' },
  { path: '/exams', icon: HiAcademicCap, label: 'Exams' },
  { path: '/routine', icon: HiCalendarDays, label: 'Routine' },
  { path: '/focus', icon: HiBolt, label: 'Focus Timer' },
  { path: '/goals', icon: HiFlag, label: 'Goals' },
  { path: '/revisions', icon: HiClock, label: 'Spaced Repetition' },
  { path: '/notes', icon: HiDocumentText, label: 'Notes' },
  { path: '/resources', icon: HiArrowUpTray, label: 'Resources' },
  { path: '/budget', icon: HiCurrencyDollar, label: 'Budget' },
  { path: '/groups', icon: HiUserGroup, label: 'Study Groups' },
  { path: '/analytics', icon: HiChartPie, label: 'Analytics' },
  { path: '/profile', icon: HiUserCircle, label: 'Profile' },
];

const mobileItems = [
  { path: '/dashboard', icon: HiHome, label: 'Home' },
  { path: '/tasks', icon: HiClipboardDocumentList, label: 'Tasks' },
  { path: '/focus', icon: HiBolt, label: 'Focus' },
  { path: '/notes', icon: HiDocumentText, label: 'Notes' },
  { path: '/profile', icon: HiUserCircle, label: 'Profile' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 z-30"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b border-surface-100 dark:border-surface-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <HiSparkles className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <h1 className="font-display font-bold text-lg text-surface-900 dark:text-white whitespace-nowrap">StudyPlanner</h1>
                <p className="text-[10px] text-surface-400 font-medium -mt-0.5">Smart Scheduling</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-surface-100 dark:border-surface-800 space-y-3">
          {/* Gamification Bar */}
          <div className="px-3">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs font-bold text-surface-800 dark:text-white">Lvl {user?.level || 1}</span>
              <span className="text-[10px] text-surface-500 font-medium">{user?.xp || 0} XP</span>
            </div>
            <div className="h-1.5 w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${((user?.xp || 0) % 500) / 5}%` }}></div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`nav-item text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 w-full ${collapsed ? 'justify-center px-0' : ''}`}
          >
            <HiArrowRightOnRectangle className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 flex items-center justify-center shadow-sm hover:shadow-md transition-all z-40"
          id="sidebar-collapse-btn"
        >
          {collapsed ? <HiChevronRight className="w-3 h-3 text-surface-500" /> : <HiChevronLeft className="w-3 h-3 text-surface-500" />}
        </button>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border-t border-surface-200 dark:border-surface-800 z-50">
        <div className="flex items-center justify-around py-2 px-2">
          {mobileItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${
                  isActive ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400 hover:text-surface-600'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
