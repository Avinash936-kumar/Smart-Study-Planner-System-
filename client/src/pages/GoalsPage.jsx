import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencilSquare, HiTrash, HiFlag, HiCheckCircle } from 'react-icons/hi2';
import { useGoals } from '../hooks/useGoals';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const GoalsPage = () => {
  const { goals, loading, createGoal, updateGoal, deleteGoal } = useGoals();
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', type: 'weekly', targetDate: '', progress: 0, linkedSubject: '', description: '', milestones: [] });
  const [newMilestone, setNewMilestone] = useState('');

  const openCreate = () => { setEditGoal(null); setForm({ title: '', type: 'weekly', targetDate: '', progress: 0, linkedSubject: '', description: '', milestones: [] }); setShowModal(true); };
  const openEdit = (g) => {
    setEditGoal(g);
    setForm({ title: g.title, type: g.type, targetDate: g.targetDate ? new Date(g.targetDate).toISOString().split('T')[0] : '', progress: g.progress, linkedSubject: g.linkedSubject || '', description: g.description || '', milestones: g.milestones || [] });
    setShowModal(true);
  };

  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    setForm({ ...form, milestones: [...form.milestones, { title: newMilestone.trim(), completed: false }] });
    setNewMilestone('');
  };

  const toggleMilestone = (index) => {
    const updated = [...form.milestones];
    updated[index].completed = !updated[index].completed;
    const completedCount = updated.filter((m) => m.completed).length;
    const progress = updated.length > 0 ? Math.round((completedCount / updated.length) * 100) : 0;
    setForm({ ...form, milestones: updated, progress });
  };

  const removeMilestone = (index) => {
    setForm({ ...form, milestones: form.milestones.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.targetDate) return;
    if (editGoal) { await updateGoal(editGoal._id, form); }
    else { await createGoal(form); }
    setShowModal(false);
  };

  const filteredGoals = filter === 'all' ? goals : goals.filter((g) => g.status === filter);
  const daysLeft = (date) => Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" text="Loading goals..." /></div>;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
      <PageHeader title="Study Goals" subtitle="Set and track your academic goals">
        <button onClick={openCreate} className="btn-gradient !py-2.5 !px-4 text-sm flex items-center gap-2" id="add-goal-btn">
          <HiPlus className="w-4 h-4" /> New Goal
        </button>
      </PageHeader>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {[{ key: 'all', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'completed', label: 'Completed' }].map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${filter === tab.key ? 'bg-primary-500 text-white shadow-lg' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {filteredGoals.length === 0 ? (
        <EmptyState icon={HiFlag} title="No goals yet" message="Create study goals to stay motivated and track your progress" actionLabel="Create Goal" onAction={openCreate} />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredGoals.map((goal) => (
              <motion.div key={goal._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="glass-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${goal.status === 'completed' ? 'badge-completed' : goal.status === 'active' ? 'badge-in-progress' : 'badge-pending'}`}>
                        {goal.type}
                      </span>
                      {goal.linkedSubject && <span className="text-xs text-surface-400">📚 {goal.linkedSubject}</span>}
                    </div>
                    <h3 className={`font-display font-bold text-surface-800 dark:text-white ${goal.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                      {goal.title}
                    </h3>
                    {goal.description && <p className="text-sm text-surface-500 mt-1">{goal.description}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(goal)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-500 transition-all">
                      <HiPencilSquare className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(goal._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-all">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-surface-400">Progress</span>
                    <span className="font-semibold text-primary-500">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${goal.progress}%` }} className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                  </div>
                </div>
                {/* Milestones */}
                {goal.milestones?.length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    {goal.milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <HiCheckCircle className={`w-4 h-4 flex-shrink-0 ${m.completed ? 'text-emerald-500' : 'text-surface-300'}`} />
                        <span className={m.completed ? 'line-through text-surface-400' : 'text-surface-600 dark:text-surface-300'}>{m.title}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-xs text-surface-400">
                  {daysLeft(goal.targetDate) > 0 ? `${daysLeft(goal.targetDate)} days left` : daysLeft(goal.targetDate) === 0 ? 'Due today' : `${Math.abs(daysLeft(goal.targetDate))} days overdue`}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editGoal ? 'Edit Goal' : 'New Goal'} icon={HiFlag}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="floating-label">Goal Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Complete DSA Module" className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="floating-label">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="floating-label">Target Date</label>
              <input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} className="input-field" required />
            </div>
          </div>
          <div>
            <label className="floating-label">Linked Subject (optional)</label>
            <input type="text" value={form.linkedSubject} onChange={(e) => setForm({ ...form, linkedSubject: e.target.value })} placeholder="e.g. Data Structures" className="input-field" />
          </div>
          <div>
            <label className="floating-label">Progress: {form.progress}%</label>
            <input type="range" value={form.progress} onChange={(e) => setForm({ ...form, progress: parseInt(e.target.value) })} min={0} max={100} className="w-full accent-primary-500" />
          </div>
          {/* Milestones */}
          <div>
            <label className="floating-label">Milestones</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={newMilestone} onChange={(e) => setNewMilestone(e.target.value)} placeholder="Add a milestone..." className="input-field flex-1"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMilestone(); } }} />
              <button type="button" onClick={addMilestone} className="btn-outline !py-2 !px-3"><HiPlus className="w-4 h-4" /></button>
            </div>
            {form.milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <button type="button" onClick={() => toggleMilestone(i)}>
                  <HiCheckCircle className={`w-5 h-5 ${m.completed ? 'text-emerald-500' : 'text-surface-300'}`} />
                </button>
                <span className={`flex-1 text-sm ${m.completed ? 'line-through text-surface-400' : ''}`}>{m.title}</span>
                <button type="button" onClick={() => removeMilestone(i)} className="text-surface-400 hover:text-red-500"><HiTrash className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gradient">{editGoal ? 'Update' : 'Create'} Goal</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteGoal(deleteId); setDeleteId(null); }} title="Delete Goal" message="This goal will be permanently deleted." />
    </div>
  );
};

export default GoalsPage;
