import { useTheme } from '../context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi2';
import { motion } from 'framer-motion';

const ThemeToggle = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleDarkMode}
      className={`relative p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors duration-200 ${className}`}
      aria-label="Toggle dark mode"
      id="theme-toggle"
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {darkMode ? (
          <HiSun className="w-5 h-5 text-amber-400" />
        ) : (
          <HiMoon className="w-5 h-5 text-primary-600" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
