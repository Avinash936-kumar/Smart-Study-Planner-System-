import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiClipboardDocumentList, HiCheckCircle, HiClock, HiExclamationTriangle,
  HiPlus, HiBolt, HiCalendarDays, HiAcademicCap, HiBookOpen, HiFlag,
  HiChartBar, HiDocumentText, HiSparkles, HiFire, HiArrowRight
} from 'react-icons/hi2';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../context/AuthContext';
import StatsWidget from '../components/StatsWidget';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ProgressBar from '../components/ProgressBar';
import QuoteCard from '../components/QuoteCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { sendNotification } from '../services/notificationService';

const DashboardPage = () => {
  const { user } = useAuth();
  const {
    tasks, loading, stats, fetchStats, createTask, updateTask, deleteTask, toggleTaskStatus, smartSchedule,
  } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [scheduling, setScheduling] = useState(false);
  const [risks, setRisks] = useState([]);

  const fetchRisks = useCallback(async () => {
    try {
      const res = await api.get('/risks');
      if (res.data.success) {
        setRisks(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch risks');
    }
  }, []);

  useEffect(() => { 
    fetchStats(); 
    fetchRisks();
  }, [fetchStats, fetchRisks]);

  const handleCreateTask = async (data) => { await createTask(data); fetchStats(); };
  const handleEditTask = (task) => { setEditTask(task); setShowModal(true); };
  const handleUpdateTask = async (data) => { if (editTask) { await updateTask(editTask._id, data); fetchStats(); setEditTask(null); } };
  const handleDeleteTask = async (id) => { await deleteTask(id); fetchStats(); };
  const handleToggle = async (id, status) => { await toggleTaskStatus(id, status); fetchStats(); };
  const handleSmartSchedule = async () => { setScheduling(true); await smartSchedule(); fetchStats(); setScheduling(false); };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
  const overdueTasks = tasks.filter((t) => t.status !== 'completed' && new Date(t.deadline) < new Date()).length;
  const productivityScore = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const upcomingTasks = tasks.filter((t) => t.status !== 'completed').sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 5);
  
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 lg:pb-10 overflow-y-auto mesh-gradient">
      {/* Hero Section */}
      <section className="mb-10">
        <div className="glass-card overflow-hidden relative border-none bg-gradient-to-br from-primary-600/10 to-accent-600/10 dark:from-primary-900/40 dark:to-accent-900/40">
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl"></div>
          
          <div className="p-6 sm:p-10 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <HiSparkles className="w-4 h-4" /> Student OS v2.0
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-surface-900 dark:text-white leading-tight mb-4">
                    {greeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
                  </h1>
                  
                  {/* XP Bar Integrated */}
                  <div className="flex flex-wrap items-center gap-6 mt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-surface-800 shadow-lg flex items-center justify-center border border-surface-100 dark:border-surface-700">
                        <span className="text-xl font-black text-primary-600 dark:text-primary-400">{user?.level || 1}</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-surface-400 uppercase">Current Level</p>
                        <p className="text-sm font-bold text-surface-700 dark:text-surface-200">Scholar Candidate</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-surface-600 dark:text-surface-300">{user?.xp || 0} XP</span>
                        <span className="text-[10px] text-surface-400 font-medium">500 XP to Level { (user?.level || 1) + 1 }</span>
                      </div>
                      <div className="h-2 w-full bg-surface-200/50 dark:bg-surface-800/50 rounded-full overflow-hidden backdrop-blur-md">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${((user?.xp || 0) % 500) / 5}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                <button onClick={handleSmartSchedule} disabled={scheduling}
                  className="btn-gradient flex items-center justify-center gap-2 group whitespace-nowrap">
                  <HiBolt className="w-5 h-5 group-hover:animate-pulse" /> 
                  {scheduling ? 'Optimizing...' : 'Smart Schedule v2'}
                </button>
                <button onClick={() => { setEditTask(null); setShowModal(true); }}
                  className="px-6 py-3 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 font-bold text-surface-700 dark:text-white hover:bg-surface-50 dark:hover:bg-surface-700 transition-all flex items-center justify-center gap-2 shadow-sm">
                  <HiPlus className="w-5 h-5" /> Quick Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid - Bento Style */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Tasks & Risks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Alerts - Premium Style */}
          {risks.length > 0 && (
            <div className="space-y-3">
              {risks.map((risk, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-2xl border-l-4 flex items-center justify-between gap-4 glass-card ${
                    risk.type === 'danger' ? 'border-red-500' : 'border-amber-500'
                  }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      risk.type === 'danger' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-500'
                    }`}>
                      <HiExclamationTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-surface-800 dark:text-white text-sm">{risk.title}</h4>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{risk.message}</p>
                    </div>
                  </div>
                  {risk.actionLink && (
                    <Link to={risk.actionLink} className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-primary-500 hover:text-white transition-all">
                      <HiArrowRight className="w-5 h-5" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Today's Focus Card */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <HiFire className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-display font-black text-surface-900 dark:text-white">Active Focus</h3>
              </div>
              <Link to="/tasks" className="text-xs font-bold text-primary-500 uppercase tracking-widest hover:underline">Manage All</Link>
            </div>
            
            {loading ? (
              <div className="py-10 flex flex-col items-center"><LoadingSpinner size="lg" /></div>
            ) : upcomingTasks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-surface-400 font-medium">Your study roadmap is clear for today! 🎉</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {upcomingTasks.slice(0, 3).map((task) => (
                  <TaskCard key={task._id} task={task} onToggle={handleToggle} onEdit={handleEditTask} onDelete={handleDeleteTask} />
                ))}
              </div>
            )}
          </div>

          {/* Productivity Stats */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-card p-6 bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20">
              <div className="flex items-center gap-3 mb-2">
                <HiCheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-surface-500 dark:text-surface-400 uppercase">Completed</span>
              </div>
              <p className="text-3xl font-black text-surface-900 dark:text-white">{completedTasks}</p>
              <p className="text-xs text-surface-500 mt-1">Excellent consistency! Keep it up.</p>
            </div>
            <div className="glass-card p-6 bg-red-500/5 dark:bg-red-500/10 border-red-500/20">
              <div className="flex items-center gap-3 mb-2">
                <HiExclamationTriangle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold text-surface-500 dark:text-surface-400 uppercase">Overdue</span>
              </div>
              <p className="text-3xl font-black text-surface-900 dark:text-white">{overdueTasks}</p>
              <p className="text-xs text-surface-500 mt-1">Needs attention immediately.</p>
            </div>
          </div>
        </div>

        {/* Right Column - Side Bento */}
        <div className="space-y-6">
          {/* Productivity Score Circle */}
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <h4 className="font-display font-black text-surface-800 dark:text-white mb-6">Efficiency Pulse</h4>
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-100 dark:text-surface-700" />
                <motion.circle 
                  cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray={2 * Math.PI * 58}
                  initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 58) * (1 - productivityScore / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-primary-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-surface-900 dark:text-white">{productivityScore}%</span>
              </div>
            </div>
            <p className="text-sm font-bold text-surface-600 dark:text-surface-300">Productivity Score</p>
            <p className="text-xs text-surface-400 mt-1">Based on current tasks</p>
          </div>

          {/* Quick Access Grid */}
          <div className="glass-card p-6">
             <h4 className="font-display font-black text-surface-800 dark:text-white text-sm mb-4">Toolbox</h4>
             <div className="grid grid-cols-2 gap-3">
              {[
                { to: '/focus', icon: HiBolt, label: 'Timer', color: 'bg-emerald-500' },
                { to: '/exams', icon: HiAcademicCap, label: 'Exams', color: 'bg-amber-500' },
                { to: '/revisions', icon: HiClock, label: 'Revision', color: 'bg-primary-500' },
                { to: '/budget', icon: HiBookOpen, label: 'Finance', color: 'bg-accent-500' },
              ].map((item) => (
                <Link key={item.to} to={item.to}
                  className="p-3 rounded-2xl bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all border border-surface-100 dark:border-surface-800">
                  <div className={`w-8 h-8 rounded-lg ${item.color} text-white flex items-center justify-center mb-2 shadow-sm`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-surface-700 dark:text-surface-300">{item.label}</span>
                </Link>
              ))}
             </div>
          </div>

          <QuoteCard />
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal isOpen={showModal} onClose={() => { setShowModal(false); setEditTask(null); }}
        onSubmit={editTask ? handleUpdateTask : handleCreateTask} editTask={editTask} />
    </div>
  );
};

export default DashboardPage;

