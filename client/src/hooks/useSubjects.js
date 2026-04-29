import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/subjects');
      setSubjects(res.data.data);
    } catch (error) {
      console.error('Fetch subjects error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  const createSubject = async (data) => {
    try {
      const res = await api.post('/subjects', data);
      setSubjects((prev) => [...prev, res.data.data]);
      toast.success('Subject created! 📚');
      return { success: true, data: res.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create subject');
      return { success: false };
    }
  };

  const updateSubject = async (id, data) => {
    try {
      const res = await api.put(`/subjects/${id}`, data);
      setSubjects((prev) => prev.map((s) => (s._id === id ? res.data.data : s)));
      toast.success('Subject updated! ✅');
      return { success: true, data: res.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update subject');
      return { success: false };
    }
  };

  const deleteSubject = async (id) => {
    try {
      await api.delete(`/subjects/${id}`);
      setSubjects((prev) => prev.filter((s) => s._id !== id));
      toast.success('Subject deleted');
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete subject');
      return { success: false };
    }
  };

  return { subjects, loading, fetchSubjects, createSubject, updateSubject, deleteSubject };
};
