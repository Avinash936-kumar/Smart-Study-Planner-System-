import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

/**
 * Custom hook for task CRUD operations
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    sort: 'createdAt',
  });

  // Fetch tasks with current filters
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;

      const res = await api.get('/tasks', { params });
      setTasks(res.data.data);
    } catch (error) {
      console.error('Fetch tasks error:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch analytics stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create task
  const createTask = async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      setTasks((prev) => [res.data.data, ...prev]);
      toast.success('Task created! 📝');
      return { success: true, data: res.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      const res = await api.put(`/tasks/${id}`, taskData);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data.data : t))
      );
      toast.success('Task updated! ✅');
      return { success: true, data: res.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted');
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete task');
      return { success: false };
    }
  };

  // Toggle task status
  const toggleTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    return updateTask(id, { status: newStatus });
  };

  // Smart schedule
  const smartSchedule = async () => {
    try {
      const res = await api.post('/tasks/schedule');
      toast.success(res.data.message);
      fetchTasks();
      return { success: true };
    } catch (error) {
      toast.error('Failed to generate schedule');
      return { success: false };
    }
  };

  return {
    tasks,
    loading,
    stats,
    filters,
    setFilters,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    smartSchedule,
  };
};
