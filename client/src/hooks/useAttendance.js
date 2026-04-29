import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance');
      if (res.data.success) {
        setAttendance(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const createAttendance = async (data) => {
    try {
      const res = await api.post('/attendance', data);
      if (res.data.success) {
        setAttendance(prev => [...prev, res.data.data]);
        toast.success('Attendance subject added');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add subject');
      return false;
    }
  };

  const updateAttendance = async (id, data) => {
    try {
      const res = await api.put(`/attendance/${id}`, data);
      if (res.data.success) {
        setAttendance(prev => prev.map(a => a._id === id ? res.data.data : a));
        return true;
      }
    } catch (error) {
      toast.error('Failed to update attendance');
      return false;
    }
  };

  const deleteAttendance = async (id) => {
    try {
      await api.delete(`/attendance/${id}`);
      setAttendance(prev => prev.filter(a => a._id !== id));
      toast.success('Subject deleted');
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  return { attendance, loading, fetchAttendance, createAttendance, updateAttendance, deleteAttendance };
};
