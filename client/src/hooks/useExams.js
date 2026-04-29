import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/exams');
      setExams(res.data.data);
    } catch (error) {
      console.error('Fetch exams error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  const createExam = async (data) => {
    try {
      const res = await api.post('/exams', data);
      setExams((prev) => [...prev, res.data.data].sort((a, b) => new Date(a.examDate) - new Date(b.examDate)));
      toast.success('Exam added! 📝');
      return { success: true, data: res.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create exam');
      return { success: false };
    }
  };

  const updateExam = async (id, data) => {
    try {
      const res = await api.put(`/exams/${id}`, data);
      setExams((prev) => prev.map((e) => (e._id === id ? res.data.data : e)));
      toast.success('Exam updated! ✅');
      fetchExams(); // re-fetch to get computed fields
      return { success: true, data: res.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update exam');
      return { success: false };
    }
  };

  const deleteExam = async (id) => {
    try {
      await api.delete(`/exams/${id}`);
      setExams((prev) => prev.filter((e) => e._id !== id));
      toast.success('Exam deleted');
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete exam');
      return { success: false };
    }
  };

  const generateRevisionPlan = async (id) => {
    try {
      const res = await api.post(`/exams/${id}/revision-plan`);
      toast.success(res.data.message);
      return { success: true, data: res.data.data };
    } catch (error) {
      toast.error('Failed to generate revision plan');
      return { success: false };
    }
  };

  return { exams, loading, fetchExams, createExam, updateExam, deleteExam, generateRevisionPlan };
};
