import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const res = await api.get('/resources', { params });
      if (res.data.success) setResources(res.data.data);
    } catch (error) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const createResource = async (data) => {
    try {
      const res = await api.post('/resources', data);
      if (res.data.success) {
        setResources(prev => [res.data.data, ...prev].sort((a, b) => b.isPinned - a.isPinned));
        toast.success('Resource added');
        return true;
      }
    } catch (error) {
      toast.error('Failed to add resource');
      return false;
    }
  };

  const deleteResource = async (id) => {
    try {
      await api.delete(`/resources/${id}`);
      setResources(prev => prev.filter(r => r._id !== id));
      toast.success('Resource deleted');
    } catch (error) {
      toast.error('Failed to delete resource');
    }
  };

  const togglePin = async (id) => {
    try {
      const res = await api.put(`/resources/${id}/pin`);
      if (res.data.success) {
        setResources(prev => prev.map(r => r._id === id ? res.data.data : r).sort((a, b) => b.isPinned - a.isPinned));
      }
    } catch (error) {
      toast.error('Failed to pin resource');
    }
  };

  return { resources, loading, fetchResources, createResource, deleteResource, togglePin };
};
