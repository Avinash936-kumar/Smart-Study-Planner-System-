import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const CalendarView = ({ tasks = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Map tasks to dates
  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      const dateKey = new Date(task.deadline).toISOString().split('T')[0];
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(task);
    });
    return map;
  }, [tasks]);

  const today = new Date().toISOString().split('T')[0];

  const days = [];
  // Empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 sm:h-14" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTasks = tasksByDate[dateStr] || [];
    const isToday = dateStr === today;
    const hasHighPriority = dayTasks.some((t) => t.priority === 'high' && t.status !== 'completed');
    const hasOverdue = dayTasks.some((t) => t.status !== 'completed' && new Date(t.deadline) < new Date());

    days.push(
      <motion.div
        key={day}
        whileHover={{ scale: 1.05 }}
        className={`h-10 sm:h-14 rounded-xl flex flex-col items-center justify-center relative cursor-default transition-all ${
          isToday
            ? 'bg-primary-500 text-white shadow-neon'
            : dayTasks.length > 0
            ? 'bg-primary-50 dark:bg-primary-900/20'
            : 'hover:bg-surface-100 dark:hover:bg-surface-800'
        }`}
      >
        <span className={`text-sm font-medium ${isToday ? 'text-white' : ''}`}>
          {day}
        </span>
        {dayTasks.length > 0 && (
          <div className="flex gap-0.5 mt-0.5">
            {dayTasks.slice(0, 3).map((t, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  t.status === 'completed'
                    ? 'bg-emerald-400'
                    : hasOverdue
                    ? 'bg-red-400'
                    : hasHighPriority
                    ? 'bg-amber-400'
                    : isToday
                    ? 'bg-white/70'
                    : 'bg-primary-400'
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-surface-800 dark:text-white">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            id="calendar-prev"
          >
            <HiChevronLeft className="w-5 h-5 text-surface-500" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            id="calendar-next"
          >
            <HiChevronRight className="w-5 h-5 text-surface-500" />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-surface-400 dark:text-surface-500 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">{days}</div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-surface-100 dark:border-surface-800">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary-400" />
          <span className="text-xs text-surface-400">Tasks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-surface-400">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-xs text-surface-400">Overdue</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
