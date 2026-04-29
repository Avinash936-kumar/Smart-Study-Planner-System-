import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status && filters.status !== 'all') params.status = filters.status;
      if (filters.type && filters.type !== 'all') params.type = filters.type;
      const res = await api.get('/goals', { params });
      setGoals(res.data.data);
    } catch (error) {
      console.error('Fetch goals error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const createGoal = async (data) => {
    try {
      const res = await api.post('/goals', data);
      setGoals((prev) => [...prev, res.data.data]);
      toast.success('Goal created! 🎯');
      return { success: true, data: res.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create goal');
      return { success: false };
    }
  };

  const updateGoal = async (id, data) => {
    try {
      const res = await api.put(`/goals/${id}`, data);
      setGoals((prev) => prev.map((g) => (g._id === id ? res.data.data : g)));
      toast.success('Goal updated! ✅');
      return { success: true, data: res.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update goal');
      return { success: false };
    }
  };

  const deleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals((prev) => prev.filter((g) => g._id !== id));
      toast.success('Goal deleted');
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete goal');
      return { success: false };
    }
  };

  return { goals, loading, fetchGoals, createGoal, updateGoal, deleteGoal };
};
