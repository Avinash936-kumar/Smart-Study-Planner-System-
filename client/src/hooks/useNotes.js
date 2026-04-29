import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.subject) params.subject = filters.subject;
      const res = await api.get('/notes', { params });
      setNotes(res.data.data);
    } catch (error) {
      console.error('Fetch notes error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const createNote = async (data) => {
    try {
      const res = await api.post('/notes', data);
      setNotes((prev) => [res.data.data, ...prev]);
      toast.success('Note created! 📝');
      return { success: true, data: res.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create note');
      return { success: false };
    }
  };

  const updateNote = async (id, data) => {
    try {
      const res = await api.put(`/notes/${id}`, data);
      setNotes((prev) => prev.map((n) => (n._id === id ? res.data.data : n)));
      toast.success('Note updated! ✅');
      return { success: true, data: res.data.data };
    } catch (error) {
      toast.error('Failed to update note');
      return { success: false };
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success('Note deleted');
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete note');
      return { success: false };
    }
  };

  const togglePin = async (id) => {
    try {
      const res = await api.patch(`/notes/${id}/pin`);
      setNotes((prev) => prev.map((n) => (n._id === id ? res.data.data : n)));
      return { success: true };
    } catch (error) {
      toast.error('Failed to toggle pin');
      return { success: false };
    }
  };

  return { notes, loading, fetchNotes, createNote, updateNote, deleteNote, togglePin };
};
