import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiCalendarDays } from 'react-icons/hi2';
import { useTasks } from '../hooks/useTasks';
import { useExams } from '../hooks/useExams';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasks, loading: tasksLoading } = useTasks();
  const { exams, loading: examsLoading } = useExams();

  const loading = tasksLoading || examsLoading;

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDate = (dateNumber) => {
    const targetDateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), dateNumber).toISOString().split('T')[0];
    
    const dayTasks = tasks.filter(t => t.deadline && new Date(t.deadline).toISOString().split('T')[0] === targetDateStr);
    const dayExams = exams.filter(e => e.examDate && new Date(e.examDate).toISOString().split('T')[0] === targetDateStr);

    return [...dayTasks.map(t => ({...t, eventType: 'task'})), ...dayExams.map(e => ({...e, eventType: 'exam'}))];
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto h-full flex flex-col">
      <PageHeader title="Academic Calendar" subtitle="Bird's eye view of your schedule" />

      <div className="glass-card p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-surface-800 dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 transition-colors">
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 transition-colors">
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-surface-200 dark:bg-surface-700 rounded-xl overflow-hidden flex-1 border border-surface-200 dark:border-surface-700">
          {/* Header */}
          {dayNames.map(day => (
            <div key={day} className="bg-surface-50 dark:bg-surface-800/80 p-3 text-center text-sm font-semibold text-surface-500 uppercase tracking-wider">
              {day}
            </div>
          ))}

          {/* Empty cells before start of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-surface-50/50 dark:bg-surface-900/50 min-h-[120px]" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dateNum = i + 1;
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), dateNum).toDateString();
            const events = getEventsForDate(dateNum);

            return (
              <div key={dateNum} className={`bg-white dark:bg-surface-800/90 p-2 min-h-[120px] transition-colors hover:bg-surface-50 dark:hover:bg-surface-800 ${isToday ? 'ring-2 ring-primary-500 inset-0 z-10 relative' : ''}`}>
                <div className={`font-semibold text-sm w-8 h-8 flex items-center justify-center rounded-full mb-2 ${isToday ? 'bg-primary-500 text-white' : 'text-surface-700 dark:text-surface-300'}`}>
                  {dateNum}
                </div>
                <div className="space-y-1 max-h-[80px] overflow-y-auto no-scrollbar">
                  {events.map((ev, idx) => (
                    <div key={idx} className={`text-xs px-2 py-1 rounded truncate ${
                      ev.eventType === 'exam' 
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800' 
                        : ev.priority === 'high' 
                          ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    }`}>
                      {ev.eventType === 'exam' ? '🎓 ' : ''}{ev.title || ev.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex gap-4 text-sm justify-center">
          <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary-500"></div> Task</span>
          <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div> High Priority</span>
          <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Exam</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
