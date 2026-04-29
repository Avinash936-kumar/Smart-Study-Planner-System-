import { motion } from 'framer-motion';

const ProgressBar = ({ value = 0, max = 100, label = '', color = 'primary', size = 'md' }) => {
  const percentage = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;

  const colors = {
    primary: 'from-primary-500 to-primary-400',
    accent: 'from-accent-500 to-accent-400',
    emerald: 'from-emerald-500 to-emerald-400',
    amber: 'from-amber-500 to-amber-400',
    red: 'from-red-500 to-red-400',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {(label || percentage > 0) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-surface-600 dark:text-surface-400">
              {label}
            </span>
          )}
          <span className="text-sm font-bold text-surface-700 dark:text-surface-300">
            {percentage}%
          </span>
        </div>
      )}
      <div
        className={`w-full ${sizes[size]} bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
