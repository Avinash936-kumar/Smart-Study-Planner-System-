import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlus, HiTrash, HiCurrencyDollar, HiChartPie } from 'react-icons/hi2';
import { useBudget } from '../hooks/useBudget';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM

const BudgetPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const { budget, loading, updateLimit, addExpense, deleteExpense } = useBudget(selectedMonth);
  
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ amount: '', description: '', category: 'other' });
  const [limitForm, setLimitForm] = useState(budget?.monthlyLimit || 5000);

  const categories = ['food', 'travel', 'books', 'hostel', 'entertainment', 'other'];

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!budget) return;
    await addExpense(budget._id, { ...expenseForm, amount: Number(expenseForm.amount) });
    setShowExpenseModal(false);
    setExpenseForm({ amount: '', description: '', category: 'other' });
  };

  const handleLimitSubmit = async (e) => {
    e.preventDefault();
    if (!budget) return;
    await updateLimit(budget._id, Number(limitForm));
    setShowLimitModal(false);
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  const totalSpent = budget ? budget.expenses.reduce((acc, curr) => acc + curr.amount, 0) : 0;
  const limit = budget ? budget.monthlyLimit : 0;
  const remaining = limit - totalSpent;
  const percentage = limit > 0 ? Math.min(Math.round((totalSpent / limit) * 100), 100) : 0;

  // Group expenses by category
  const categoryData = categories.map(cat => ({
    name: cat,
    value: budget ? budget.expenses.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0) : 0
  })).filter(c => c.value > 0);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
      <PageHeader title="Student Budget" subtitle="Track your monthly expenses">
        <div className="flex gap-2">
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="input-field !py-2 !w-40" />
          <button onClick={() => setShowExpenseModal(true)} className="btn-gradient !py-2.5 !px-4 text-sm flex items-center gap-2">
            <HiPlus className="w-4 h-4" /> Expense
          </button>
        </div>
      </PageHeader>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 bg-gradient-to-br from-primary-500/10 to-primary-600/10">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-surface-500 font-medium">Monthly Limit</h3>
            <button onClick={() => { setLimitForm(limit); setShowLimitModal(true); }} className="text-xs text-primary-500 hover:underline">Edit</button>
          </div>
          <p className="text-3xl font-display font-bold text-surface-800 dark:text-white">₹{limit}</p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-surface-500 font-medium mb-2">Total Spent</h3>
          <p className="text-3xl font-display font-bold text-red-500">₹{totalSpent}</p>
        </div>
        <div className={`glass-card p-6 ${remaining < 0 ? 'border border-red-500' : ''}`}>
          <h3 className="text-surface-500 font-medium mb-2">Remaining</h3>
          <p className={`text-3xl font-display font-bold ${remaining < 0 ? 'text-red-500' : 'text-emerald-500'}`}>₹{remaining}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress Bar & Categories */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold text-surface-800 dark:text-white mb-4">Budget Usage</h3>
            <div className="flex justify-between text-sm mb-2">
              <span>{percentage}% Used</span>
              <span className={remaining < 0 ? 'text-red-500 font-bold' : ''}>{remaining < 0 ? 'Over budget!' : ''}</span>
            </div>
            <div className="h-3 w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
              <div className={`h-full ${percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-amber-500' : 'bg-primary-500'}`} style={{ width: `${percentage}%` }} />
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-surface-800 dark:text-white mb-4 flex items-center gap-2"><HiChartPie className="text-primary-500" /> By Category</h3>
            {categoryData.length === 0 ? <p className="text-surface-400 text-sm">No expenses yet.</p> : (
              <div className="space-y-3">
                {categoryData.sort((a,b) => b.value - a.value).map((cat, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="capitalize text-surface-600 dark:text-surface-300">{cat.name}</span>
                    <span className="font-semibold text-surface-800 dark:text-white">₹{cat.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Expense List */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
            <h3 className="font-bold text-surface-800 dark:text-white">Recent Transactions</h3>
          </div>
          
          {(!budget || budget.expenses.length === 0) ? (
            <div className="p-12 text-center text-surface-500">
              <HiCurrencyDollar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No expenses recorded this month.</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-100 dark:divide-surface-800 max-h-[500px] overflow-y-auto">
              {budget.expenses.slice().sort((a,b) => new Date(b.date) - new Date(a.date)).map(exp => (
                <div key={exp._id} className="p-4 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50">
                  <div>
                    <p className="font-semibold text-surface-800 dark:text-white">{exp.description}</p>
                    <div className="flex items-center gap-2 text-xs text-surface-500 mt-1">
                      <span className="capitalize px-2 py-0.5 rounded-md bg-surface-200 dark:bg-surface-700">{exp.category}</span>
                      <span>{new Date(exp.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-red-500">-₹{exp.amount}</span>
                    <button onClick={() => deleteExpense(budget._id, exp._id)} className="text-surface-400 hover:text-red-500"><HiTrash className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expense Modal */}
      <Modal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="Add Expense">
        <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4">
          <div><label className="floating-label">Amount (₹)</label><input type="number" min="1" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...form, amount: e.target.value })} className="input-field" required /></div>
          <div><label className="floating-label">Description</label><input type="text" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...form, description: e.target.value })} className="input-field" required placeholder="e.g. Lunch at canteen" /></div>
          <div>
            <label className="floating-label">Category</label>
            <select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...form, category: e.target.value })} className="input-field capitalize">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowExpenseModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gradient">Save</button>
          </div>
        </form>
      </Modal>

      {/* Limit Modal */}
      <Modal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} title="Update Budget Limit">
        <form onSubmit={handleLimitSubmit} className="p-6 space-y-4">
          <div><label className="floating-label">Monthly Limit (₹)</label><input type="number" min="1" value={limitForm} onChange={(e) => setLimitForm(e.target.value)} className="input-field" required /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowLimitModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gradient">Update</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BudgetPage;
