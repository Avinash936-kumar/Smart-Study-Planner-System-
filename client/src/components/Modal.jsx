import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';

const Modal = ({ isOpen, onClose, title, icon: Icon, children, maxWidth = 'max-w-lg' }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`w-full ${maxWidth} bg-white dark:bg-surface-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 dark:border-surface-800 flex-shrink-0">
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-5 h-5 text-primary-500" />}
              <h2 className="text-lg font-display font-bold text-surface-900 dark:text-white">{title}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <HiXMark className="w-5 h-5 text-surface-400" />
            </button>
          </div>
          {/* Content */}
          <div className="overflow-y-auto flex-1">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Modal;
