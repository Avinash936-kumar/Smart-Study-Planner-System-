import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPlus, HiTrash, HiPencilSquare, HiCalendarDays, HiCheckCircle } from 'react-icons/hi2';
import { useRoutine } from '../hooks/useRoutine';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TYPES = [
  { value: 'class', label: '📖 Class', color: '#6366f1' },
  { value: 'study', label: '📚 Study', color: '#10b981' },
  { value: 'break', label: '☕ Break', color: '#f59e0b' },
  { value: 'exercise', label: '🏃 Exercise', color: '#ef4444' },
  { value: 'meal', label: '🍽️ Meal', color: '#f97316' },
  { value: 'sleep', label: '😴 Sleep', color: '#8b5cf6' },
  { value: 'other', label: '📌 Other', color: '#64748b' },
];

const RoutinePage = () => {
  const { blocks, loading, dailyScore, fetchBlocks, createBlock, updateBlock, deleteBlock, toggleBlock } = useRoutine();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [showModal, setShowModal] = useState(false);
  const [editBlock, setEditBlock] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ title: '', type: 'study', dayOfWeek: selectedDay, startTime: '09:00', endTime: '10:00', subject: '', color: '#10b981' });

  useEffect(() => { fetchBlocks(selectedDay); }, [selectedDay, fetchBlocks]);

  const todayBlocks = blocks.filter((b) => b.dayOfWeek === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const openCreate = () => {
    setEditBlock(null);
    setForm({ title: '', type: 'study', dayOfWeek: selectedDay, startTime: '09:00', endTime: '10:00', subject: '', color: '#10b981' });
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditBlock(b);
    setForm({ title: b.title, type: b.type, dayOfWeek: b.dayOfWeek, startTime: b.startTime, endTime: b.endTime, subject: b.subject || '', color: b.color });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editBlock) await updateBlock(editBlock._id, form);
    else await createBlock(form);
    setShowModal(false);
    fetchBlocks(selectedDay);
  };

  const handleTypeChange = (type) => {
    const t = TYPES.find((x) => x.value === type);
    setForm({ ...form, type, color: t?.color || '#64748b' });
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" text="Loading routine..." /></div>;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
      <PageHeader title="Daily Routine" subtitle="Plan and track your daily schedule">
        <button onClick={openCreate} className="btn-gradient !py-2.5 !px-4 text-sm flex items-center gap-2" id="add-routine-btn">
          <HiPlus className="w-4 h-4" /> Add Block
        </button>
      </PageHeader>

      {/* Daily Score */}
      {dailyScore && selectedDay === new Date().getDay() && (
        <div className="glass-card p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-surface-400">Today's Completion</p>
            <p className="text-2xl font-display font-bold text-surface-800 dark:text-white">{dailyScore.score}%</p>
          </div>
          <div className="text-right text-sm text-surface-400">
            <p>{dailyScore.completed}/{dailyScore.total} blocks done</p>
          </div>
        </div>
      )}

      {/* Day Selector */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {DAYS.map((day, i) => (
          <button key={i} onClick={() => setSelectedDay(i)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              selectedDay === i ? 'bg-primary-500 text-white shadow-lg' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
            } ${i === new Date().getDay() && selectedDay !== i ? 'ring-2 ring-primary-300' : ''}`}>
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {todayBlocks.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiCalendarDays className="w-16 h-16 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
          <h3 className="text-lg font-display font-bold text-surface-700 dark:text-surface-300 mb-2">No blocks for {DAYS[selectedDay]}</h3>
          <p className="text-surface-400 mb-4">Add study sessions, classes, and breaks</p>
          <button onClick={openCreate} className="btn-gradient text-sm"><HiPlus className="w-4 h-4 inline mr-1" /> Add Block</button>
        </div>
      ) : (
        <div className="space-y-3">
          {todayBlocks.map((block) => (
            <motion.div key={block._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className={`glass-card p-4 border-l-4 flex items-center gap-4 ${block.completed ? 'opacity-60' : ''}`}
              style={{ borderLeftColor: block.color }}>
              <button onClick={() => toggleBlock(block._id)}
                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  block.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-surface-300 dark:border-surface-600 hover:border-primary-500'
                }`}>
                {block.completed && <HiCheckCircle className="w-4 h-4" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-surface-400">{block.startTime} - {block.endTime}</span>
                  <span className="badge bg-surface-100 dark:bg-surface-800 text-surface-500 text-xs">{block.type}</span>
                </div>
                <h4 className={`font-semibold text-surface-800 dark:text-white ${block.completed ? 'line-through' : ''}`}>{block.title}</h4>
                {block.subject && <p className="text-xs text-surface-400">📚 {block.subject}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(block)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-500 transition-all">
                  <HiPencilSquare className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(block._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-all">
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editBlock ? 'Edit Block' : 'Add Block'} icon={HiCalendarDays}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="floating-label">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Morning Study" className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="floating-label">Type</label>
              <select value={form.type} onChange={(e) => handleTypeChange(e.target.value)} className="input-field">
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="floating-label">Day</label>
              <select value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: parseInt(e.target.value) })} className="input-field">
                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="floating-label">Start Time</label><input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="input-field" required /></div>
            <div><label className="floating-label">End Time</label><input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="input-field" required /></div>
          </div>
          <div>
            <label className="floating-label">Subject (optional)</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Data Structures" className="input-field" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gradient">{editBlock ? 'Update' : 'Add'} Block</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteBlock(deleteId); setDeleteId(null); }} />
    </div>
  );
};

export default RoutinePage;
