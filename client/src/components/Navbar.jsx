import { useAuth } from '../context/AuthContext';
import { HiSparkles } from 'react-icons/hi2';
import ThemeToggle from './ThemeToggle';
import NotificationPanel from './NotificationPanel';
import { useTasks } from '../hooks/useTasks';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();

  return (
    <header className="h-16 flex-shrink-0 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800 flex items-center justify-between px-4 sm:px-6 z-20">
      {/* Mobile Logo (hidden on desktop) */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
          <HiSparkles className="w-4 h-4 text-white" />
        </div>
        <h1 className="font-display font-bold text-base text-surface-900 dark:text-white">
          StudyPlanner
        </h1>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden lg:block flex-1"></div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        <NotificationPanel tasks={tasks || []} />
        <ThemeToggle />
        
        {/* User Profile Snippet */}
        {user && (
          <div className="flex items-center gap-4 pl-3 ml-1 border-l border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 leading-tight">
                  {user.name?.split(' ')[0]}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
            
            <button
              onClick={logout}
              className="text-surface-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
