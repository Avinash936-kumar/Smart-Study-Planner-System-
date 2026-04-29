import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useRoutine = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyScore, setDailyScore] = useState(null);

  const fetchBlocks = useCallback(async (day) => {
    try {
      setLoading(true);
      const params = day !== undefined ? { day } : {};
      const res = await api.get('/routine', { params });
      setBlocks(res.data.data);
    } catch (error) {
      console.error('Fetch routine error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDailyScore = useCallback(async () => {
    try {
      const res = await api.get('/routine/score');
      setDailyScore(res.data.data);
    } catch (error) {
      console.error('Fetch daily score error:', error);
    }
  }, []);

  useEffect(() => { fetchBlocks(); fetchDailyScore(); }, [fetchBlocks, fetchDailyScore]);

  const createBlock = async (data) => {
    try {
      const res = await api.post('/routine', data);
      setBlocks((prev) => [...prev, res.data.data].sort((a, b) => a.startTime.localeCompare(b.startTime)));
      toast.success('Routine block added! ⏰');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create block');
      return { success: false };
    }
  };

  const updateBlock = async (id, data) => {
    try {
      const res = await api.put(`/routine/${id}`, data);
      setBlocks((prev) => prev.map((b) => (b._id === id ? res.data.data : b)));
      toast.success('Block updated! ✅');
      return { success: true };
    } catch (error) {
      toast.error('Failed to update block');
      return { success: false };
    }
  };

  const deleteBlock = async (id) => {
    try {
      await api.delete(`/routine/${id}`);
      setBlocks((prev) => prev.filter((b) => b._id !== id));
      toast.success('Block deleted');
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete block');
      return { success: false };
    }
  };

  const toggleBlock = async (id) => {
    try {
      const res = await api.patch(`/routine/${id}/toggle`);
      setBlocks((prev) => prev.map((b) => (b._id === id ? res.data.data : b)));
      fetchDailyScore();
      return { success: true };
    } catch (error) {
      toast.error('Failed to toggle block');
      return { success: false };
    }
  };

  return { blocks, loading, dailyScore, fetchBlocks, fetchDailyScore, createBlock, updateBlock, deleteBlock, toggleBlock };
};
