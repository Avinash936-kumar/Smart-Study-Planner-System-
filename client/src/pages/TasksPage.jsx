import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus,
  HiMagnifyingGlass,
  HiFunnel,
  HiArrowsUpDown,
  HiBolt,
} from 'react-icons/hi2';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import LoadingSpinner from '../components/LoadingSpinner';

const TasksPage = () => {
  const {
    tasks,
    loading,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    smartSchedule,
    fetchStats,
  } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [scheduling, setScheduling] = useState(false);

  const handleCreateTask = async (data) => {
    await createTask(data);
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleUpdateTask = async (data) => {
    if (editTask) {
      await updateTask(editTask._id, data);
      setEditTask(null);
    }
  };

  const handleSmartSchedule = async () => {
    setScheduling(true);
    await smartSchedule();
    setScheduling(false);
  };

  const statusCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-scroll overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white">
            My Tasks
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Manage and organize all your study tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSmartSchedule}
            disabled={scheduling}
            className="btn-outline !py-2.5 !px-4 text-sm flex items-center gap-2 disabled:opacity-50"
            id="tasks-schedule-btn"
          >
            <HiBolt className="w-4 h-4" />
            {scheduling ? 'Scheduling...' : 'Auto Schedule'}
          </button>
          <button
            onClick={() => {
              setEditTask(null);
              setShowModal(true);
            }}
            className="btn-gradient !py-2.5 !px-4 text-sm flex items-center gap-2"
            id="tasks-add-btn"
          >
            <HiPlus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="input-field !pl-10 !py-2.5"
              id="tasks-search"
            />
          </div>

          {/* Priority filter */}
          <div className="relative">
            <HiFunnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <select
              value={filters.priority}
              onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
              className="input-field !pl-9 !py-2.5 !pr-8 min-w-[140px]"
              id="tasks-priority-filter"
            >
              <option value="all">All Priority</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <HiArrowsUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <select
              value={filters.sort}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
              className="input-field !pl-9 !py-2.5 !pr-8 min-w-[140px]"
              id="tasks-sort"
            >
              <option value="createdAt">Newest</option>
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'in-progress', label: 'In Progress' },
          { key: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilters((f) => ({ ...f, status: tab.key }))}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              filters.status === tab.key
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
            }`}
            id={`tab-${tab.key}`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-70">
              ({statusCounts[tab.key] || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Task list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Loading tasks..." />
        </div>
      ) : tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-16 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-lg font-display font-bold text-surface-700 dark:text-surface-300 mb-2">
            {filters.search || filters.status !== 'all' || filters.priority !== 'all'
              ? 'No matching tasks found'
              : 'No tasks yet'}
          </h3>
          <p className="text-surface-400 mb-6">
            {filters.search || filters.status !== 'all' || filters.priority !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first task to get started!'}
          </p>
          <button
            onClick={() => {
              setEditTask(null);
              setShowModal(true);
            }}
            className="btn-gradient text-sm"
          >
            <HiPlus className="w-4 h-4 inline mr-1" />
            Create Task
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={toggleTaskStatus}
                onEdit={handleEditTask}
                onDelete={(id) => deleteTask(id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditTask(null);
        }}
        onSubmit={editTask ? handleUpdateTask : handleCreateTask}
        editTask={editTask}
      />
    </div>
  );
};

export default TasksPage;
