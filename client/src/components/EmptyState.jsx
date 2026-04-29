import { motion } from 'framer-motion';
import { HiPlus } from 'react-icons/hi2';

const EmptyState = ({ icon: Icon, title, message, actionLabel, onAction }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="glass-card p-12 sm:p-16 text-center"
  >
    {Icon && (
      <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-10 h-10 text-surface-300 dark:text-surface-600" />
      </div>
    )}
    <h3 className="text-lg font-display font-bold text-surface-700 dark:text-surface-300 mb-2">
      {title}
    </h3>
    <p className="text-surface-400 mb-6 max-w-sm mx-auto">{message}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn-gradient text-sm" id="empty-state-action">
        <HiPlus className="w-4 h-4 inline mr-1" />
        {actionLabel}
      </button>
    )}
  </motion.div>
);

export default EmptyState;
