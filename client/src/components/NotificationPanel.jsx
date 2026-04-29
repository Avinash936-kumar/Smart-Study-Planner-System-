import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiBell,
  HiXMark,
  HiExclamationTriangle,
  HiClock,
  HiCheckCircle,
} from 'react-icons/hi2';

const NotificationPanel = ({ tasks = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    generateNotifications();
  }, [tasks]);

  const generateNotifications = () => {
    const now = new Date();
    const notifs = [];

    tasks.forEach((task) => {
      if (task.status === 'completed') return;

      const deadline = new Date(task.deadline);
      const hoursLeft = (deadline - now) / (1000 * 60 * 60);

      if (hoursLeft < 0) {
        notifs.push({
          id: `overdue-${task._id}`,
          type: 'overdue',
          title: 'Overdue Task',
          message: `"${task.title}" is past its deadline!`,
          icon: HiExclamationTriangle,
          color: 'text-red-500',
          bg: 'bg-red-50 dark:bg-red-900/20',
          time: Math.abs(Math.round(hoursLeft)) + 'h overdue',
        });
      } else if (hoursLeft <= 24) {
        notifs.push({
          id: `urgent-${task._id}`,
          type: 'urgent',
          title: 'Due Soon',
          message: `"${task.title}" is due within ${Math.round(hoursLeft)}h`,
          icon: HiClock,
          color: 'text-amber-500',
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          time: Math.round(hoursLeft) + 'h left',
        });
      } else if (hoursLeft <= 72) {
        notifs.push({
          id: `reminder-${task._id}`,
          type: 'reminder',
          title: 'Upcoming Deadline',
          message: `"${task.title}" is due in ${Math.round(hoursLeft / 24)} days`,
          icon: HiClock,
          color: 'text-primary-500',
          bg: 'bg-primary-50 dark:bg-primary-900/20',
          time: Math.round(hoursLeft / 24) + 'd left',
        });
      }
    });

    // Sort by urgency
    notifs.sort((a, b) => {
      const order = { overdue: 0, urgent: 1, reminder: 2 };
      return (order[a.type] || 3) - (order[b.type] || 3);
    });

    setNotifications(notifs);
  };

  const urgentCount = notifications.filter(
    (n) => n.type === 'overdue' || n.type === 'urgent'
  ).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
        id="notification-bell"
      >
        <HiBell className="w-5 h-5 text-surface-600 dark:text-surface-400" />
        {urgentCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {urgentCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-surface-900 rounded-2xl shadow-glass-lg border border-surface-100 dark:border-surface-800 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-surface-100 dark:border-surface-800">
                <h3 className="font-display font-bold text-surface-800 dark:text-white">
                  Notifications
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
                >
                  <HiXMark className="w-4 h-4 text-surface-400" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <HiCheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm text-surface-500 dark:text-surface-400 font-medium">
                      All caught up! No urgent notifications.
                    </p>
                  </div>
                ) : (
                  notifications.map((notif, i) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-4 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors border-b border-surface-50 dark:border-surface-800 last:border-0"
                    >
                      <div className={`p-2 rounded-lg ${notif.bg} flex-shrink-0`}>
                        <notif.icon className={`w-4 h-4 ${notif.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                          {notif.title}
                        </p>
                        <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 truncate">
                          {notif.message}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold flex-shrink-0 ${notif.color}`}>
                        {notif.time}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;
