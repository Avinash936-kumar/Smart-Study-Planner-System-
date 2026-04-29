import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useBudget = (month) => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBudget = useCallback(async () => {
    if (!month) return;
    try {
      setLoading(true);
      const res = await api.get(`/budget?month=${month}`);
      if (res.data.success) setBudget(res.data.data);
    } catch (error) {
      toast.error('Failed to load budget');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { fetchBudget(); }, [fetchBudget]);

  const updateLimit = async (id, monthlyLimit) => {
    try {
      const res = await api.put(`/budget/${id}/limit`, { monthlyLimit });
      if (res.data.success) {
        setBudget(res.data.data);
        toast.success('Limit updated');
      }
    } catch (error) {
      toast.error('Failed to update limit');
    }
  };

  const addExpense = async (id, data) => {
    try {
      const res = await api.post(`/budget/${id}/expense`, data);
      if (res.data.success) {
        setBudget(res.data.data);
        toast.success('Expense added');
        return true;
      }
    } catch (error) {
      toast.error('Failed to add expense');
      return false;
    }
  };

  const deleteExpense = async (id, expenseId) => {
    try {
      const res = await api.delete(`/budget/${id}/expense/${expenseId}`);
      if (res.data.success) {
        setBudget(res.data.data);
        toast.success('Expense deleted');
      }
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  return { budget, loading, fetchBudget, updateLimit, addExpense, deleteExpense };
};
