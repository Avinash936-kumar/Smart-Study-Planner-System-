import { useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useFocus = () => {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await api.get('/focus');
      setSessions(res.data.data);
    } catch (error) {
      console.error('Fetch focus sessions error:', error);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/focus/stats');
      setStats(res.data.data);
    } catch (error) {
      console.error('Fetch focus stats error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSession = async (data) => {
    try {
      const res = await api.post('/focus', data);
      setSessions((prev) => [res.data.data, ...prev]);
      toast.success('Focus session saved! 🎯');
      fetchStats();
      return { success: true };
    } catch (error) {
      toast.error('Failed to save session');
      return { success: false };
    }
  };

  return { sessions, stats, loading, fetchSessions, fetchStats, saveSession };
};
