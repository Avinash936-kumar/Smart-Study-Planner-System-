import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className={`${sizes[size]} border-3 border-surface-200 dark:border-surface-700 border-t-primary-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ borderWidth: '3px' }}
      />
      {text && (
        <p className="text-sm text-surface-500 dark:text-surface-400 font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

// Full page loading screen
export const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-neon">
        <span className="text-2xl font-bold text-white font-display">S</span>
      </div>
      <LoadingSpinner size="md" text="Loading..." />
    </motion.div>
  </div>
);

export default LoadingSpinner;
