import { motion } from 'framer-motion';
import {
  HiCheckCircle,
  HiClock,
  HiTrash,
  HiPencilSquare,
  HiExclamationTriangle,
  HiCalendarDays,
  HiBookOpen,
  HiFire,
} from 'react-icons/hi2';

const priorityConfig = {
  high: { 
    color: 'border-l-red-500', 
    badge: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    icon: HiFire,
    label: 'Urgent' 
  },
  medium: { 
    color: 'border-l-amber-500', 
    badge: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    icon: HiClock,
    label: 'Medium' 
  },
  low: { 
    color: 'border-l-emerald-500', 
    badge: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    icon: HiCheckCircle,
    label: 'Low' 
  },
};

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const isCompleted = task.status === 'completed';
  const isOverdue = !isCompleted && new Date(task.deadline) < new Date();

  const daysUntilDeadline = () => {
    const diff = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return 'Due today';
    if (diff === 1) return 'Due tomorrow';
    return `${diff}d left`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className={`glass-card p-5 border-l-[6px] ${priority.color} group relative ${isCompleted ? 'opacity-60 grayscale-[0.5]' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Completion Toggle */}
        <button
          onClick={() => onToggle(task._id, task.status)}
          className={`mt-1 w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
            isCompleted
              ? 'bg-primary-500 border-primary-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
              : 'border-surface-200 dark:border-surface-700 hover:border-primary-500 dark:hover:border-primary-400'
          }`}
        >
          {isCompleted && <HiCheckCircle className="w-4 h-4" />}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className={`text-base font-bold text-surface-900 dark:text-white leading-tight transition-all ${isCompleted ? 'line-through text-surface-400 opacity-60' : ''}`}>
                {task.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-[11px] font-bold text-surface-400 uppercase tracking-tight">
                  <HiBookOpen className="w-3.5 h-3.5" />
                  {task.subject}
                </span>
                <span className="text-surface-300 text-[10px]">•</span>
                <span className={`flex items-center gap-1 text-[11px] font-bold uppercase ${isOverdue ? 'text-red-500' : 'text-surface-400'}`}>
                  {isOverdue ? <HiExclamationTriangle className="w-3.5 h-3.5" /> : <HiCalendarDays className="w-3.5 h-3.5" />}
                  {daysUntilDeadline()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(task)} className="p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 text-surface-400 hover:text-primary-500 transition-all">
                <HiPencilSquare className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(task._id)} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-all">
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Priority Badge */}
          <div className="mt-4 flex items-center gap-3">
             <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${priority.badge}`}>
               <priority.icon className="w-3.5 h-3.5" />
               {priority.label}
             </div>
             {task.estimatedHours && (
               <div className="flex items-center gap-1 text-[11px] font-bold text-surface-400">
                 <HiClock className="w-3.5 h-3.5" />
                 {task.estimatedHours}h est.
               </div>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;

