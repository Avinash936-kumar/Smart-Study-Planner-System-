import { motion, AnimatePresence } from 'framer-motion';
import { HiExclamationTriangle } from 'react-icons/hi2';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Confirm Delete', message = 'Are you sure? This action cannot be undone.', confirmLabel = 'Delete', danger = true }) => (
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-sm bg-white dark:bg-surface-900 rounded-2xl shadow-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${danger ? 'bg-red-100 dark:bg-red-900/20' : 'bg-amber-100 dark:bg-amber-900/20'}`}>
              <HiExclamationTriangle className={`w-5 h-5 ${danger ? 'text-red-500' : 'text-amber-500'}`} />
            </div>
            <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white">{title}</h3>
          </div>
          <p className="text-surface-500 dark:text-surface-400 mb-6 text-sm">{message}</p>
          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose} className="btn-ghost text-sm">Cancel</button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}`}
              id="confirm-dialog-btn"
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ConfirmDialog;
