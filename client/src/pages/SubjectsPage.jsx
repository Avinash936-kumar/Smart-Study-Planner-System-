import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencilSquare, HiTrash, HiBookOpen, HiCheckCircle } from 'react-icons/hi2';
import { useSubjects } from '../hooks/useSubjects';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';

const COLORS = ['#6366f1','#d946ef','#f59e0b','#10b981','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316'];

const SubjectsPage = () => {
  const { subjects, loading, createSubject, updateSubject, deleteSubject } = useSubjects();
  const [showModal, setShowModal] = useState(false);
  const [editSubject, setEditSubject] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ name: '', color: '#6366f1', description: '', targetHours: 10, icon: '📚' });

  const openCreate = () => { setEditSubject(null); setForm({ name: '', color: '#6366f1', description: '', targetHours: 10, icon: '📚' }); setShowModal(true); };
  const openEdit = (s) => { setEditSubject(s); setForm({ name: s.name, color: s.color, description: s.description, targetHours: s.targetHours, icon: s.icon }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editSubject) { await updateSubject(editSubject._id, form); }
    else { await createSubject(form); }
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (deleteId) { await deleteSubject(deleteId); setDeleteId(null); }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" text="Loading subjects..." /></div>;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
      <PageHeader title="Subjects" subtitle="Organize your courses and track study progress">
        <button onClick={openCreate} className="btn-gradient !py-2.5 !px-4 text-sm flex items-center gap-2" id="add-subject-btn">
          <HiPlus className="w-4 h-4" /> Add Subject
        </button>
      </PageHeader>

      {subjects.length === 0 ? (
        <EmptyState icon={HiBookOpen} title="No subjects yet" message="Add your subjects to organize tasks and track progress" actionLabel="Add Subject" onAction={openCreate} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {subjects.map((subject) => (
              <motion.div key={subject._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} whileHover={{ y: -4 }}
                className="glass-card p-5 border-l-4 cursor-default" style={{ borderLeftColor: subject.color }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{subject.icon}</span>
                    <h3 className="font-display font-bold text-surface-800 dark:text-white">{subject.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(subject)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-500 transition-all">
                      <HiPencilSquare className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(subject._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-all">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {subject.description && <p className="text-sm text-surface-500 dark:text-surface-400 mb-3 line-clamp-2">{subject.description}</p>}
                <div className="flex items-center gap-4 text-xs text-surface-400 mb-3">
                  <span className="flex items-center gap-1"><HiBookOpen className="w-3.5 h-3.5" /> {subject.totalTasks || 0} tasks</span>
                  <span className="flex items-center gap-1"><HiCheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {subject.completedPercentage || 0}% done</span>
                </div>
                <ProgressBar value={subject.currentHours || 0} max={subject.targetHours || 1} label={`${(subject.currentHours || 0).toFixed(1)}/${subject.targetHours}h target`} color="primary" size="sm" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editSubject ? 'Edit Subject' : 'Add Subject'} icon={HiBookOpen}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="floating-label">Subject Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Data Structures" className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="floating-label">Icon</label>
              <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input-field" maxLength={4} />
            </div>
            <div>
              <label className="floating-label">Target Hours</label>
              <input type="number" value={form.targetHours} onChange={(e) => setForm({ ...form, targetHours: parseInt(e.target.value) || 10 })} min={1} max={500} className="input-field" />
            </div>
          </div>
          <div>
            <label className="floating-label">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                  className={`w-8 h-8 rounded-lg transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div>
            <label className="floating-label">Description (optional)</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." rows={2} className="input-field resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gradient">{editSubject ? 'Update' : 'Create'} Subject</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Subject" message="This will delete the subject. Tasks linked to it will not be deleted." />
    </div>
  );
};

export default SubjectsPage;
