import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups');
      if (res.data.success) setGroups(res.data.data);
    } catch (error) {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const createGroup = async (data) => {
    try {
      const res = await api.post('/groups', data);
      if (res.data.success) {
        fetchGroups(); // Refetch to populate members
        toast.success('Group created');
        return true;
      }
    } catch (error) {
      toast.error('Failed to create group');
      return false;
    }
  };

  const joinGroup = async (inviteCode) => {
    try {
      const res = await api.post('/groups/join', { inviteCode });
      if (res.data.success) {
        fetchGroups();
        toast.success('Joined group successfully');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join group');
      return false;
    }
  };

  const addSharedTask = async (id, task) => {
    try {
      const res = await api.post(`/groups/${id}/tasks`, task);
      if (res.data.success) {
        setGroups(prev => prev.map(g => g._id === id ? res.data.data : g));
        toast.success('Task shared with group');
        return true;
      }
    } catch (error) {
      toast.error('Failed to share task');
      return false;
    }
  };

  const completeSharedTask = async (id, taskId) => {
    try {
      const res = await api.put(`/groups/${id}/tasks/${taskId}/complete`);
      if (res.data.success) {
        setGroups(prev => prev.map(g => g._id === id ? res.data.data : g));
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  return { groups, loading, fetchGroups, createGroup, joinGroup, addSharedTask, completeSharedTask };
};
