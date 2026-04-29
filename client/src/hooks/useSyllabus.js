import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useSyllabus = () => {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSyllabus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/syllabus');
      if (res.data.success) setSyllabus(res.data.data);
    } catch (error) {
      toast.error('Failed to load syllabus');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSyllabus(); }, [fetchSyllabus]);

  const createSyllabus = async (data) => {
    try {
      const res = await api.post('/syllabus', data);
      if (res.data.success) {
        setSyllabus(prev => [...prev, res.data.data]);
        toast.success('Syllabus added');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add syllabus');
      return false;
    }
  };

  const updateSyllabus = async (id, data) => {
    try {
      const res = await api.put(`/syllabus/${id}`, data);
      if (res.data.success) {
        setSyllabus(prev => prev.map(s => s._id === id ? res.data.data : s));
        return true;
      }
    } catch (error) {
      toast.error('Failed to update syllabus');
      return false;
    }
  };

  const deleteSyllabus = async (id) => {
    try {
      await api.delete(`/syllabus/${id}`);
      setSyllabus(prev => prev.filter(s => s._id !== id));
      toast.success('Syllabus deleted');
    } catch (error) {
      toast.error('Failed to delete syllabus');
    }
  };

  return { syllabus, loading, fetchSyllabus, createSyllabus, updateSyllabus, deleteSyllabus };
};
