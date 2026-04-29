import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useRevision = () => {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRevisions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/revisions');
      if (res.data.success) setRevisions(res.data.data);
    } catch (error) {
      toast.error('Failed to load revisions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRevisions(); }, [fetchRevisions]);

  const createRevision = async (data) => {
    try {
      const res = await api.post('/revisions', data);
      if (res.data.success) {
        setRevisions(prev => [...prev, res.data.data].sort((a,b) => new Date(a.nextRevisionDate) - new Date(b.nextRevisionDate)));
        toast.success('Revision scheduled');
        return true;
      }
    } catch (error) {
      toast.error('Failed to schedule revision');
      return false;
    }
  };

  const logRevision = async (id, status) => {
    try {
      const res = await api.post(`/revisions/${id}/log`, { status });
      if (res.data.success) {
        setRevisions(prev => prev.map(r => r._id === id ? res.data.data : r).sort((a,b) => new Date(a.nextRevisionDate) - new Date(b.nextRevisionDate)));
        toast.success(`Logged as ${status}`);
        return true;
      }
    } catch (error) {
      toast.error('Failed to log revision');
      return false;
    }
  };

  const deleteRevision = async (id) => {
    try {
      await api.delete(`/revisions/${id}`);
      setRevisions(prev => prev.filter(r => r._id !== id));
      toast.success('Revision deleted');
    } catch (error) {
      toast.error('Failed to delete revision');
    }
  };

  return { revisions, loading, fetchRevisions, createRevision, logRevision, deleteRevision };
};
