import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiClock, HiCheck, HiExclamationTriangle, HiInformationCircle } from 'react-icons/hi2';
import { useRevision } from '../hooks/useRevision';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const RevisionPage = () => {
  const { revisions, loading, createRevision, logRevision, deleteRevision } = useRevision();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ topic: '', subject: '', nextRevisionDate: new Date().toISOString().split('T')[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createRevision(form);
    setShowModal(false);
    setForm({ topic: '', subject: '', nextRevisionDate: new Date().toISOString().split('T')[0] });
  };

  const handleLog = async (id, status) => {
    await logRevision(id, status);
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  const today = new Date();
  today.setHours(0,0,0,0);

  const dueToday = revisions.filter(r => new Date(r.nextRevisionDate) <= today);
  const upcoming = revisions.filter(r => new Date(r.nextRevisionDate) > today);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
      <PageHeader title="Spaced Repetition" subtitle="Optimize your memory retention">
        <button onClick={() => setShowModal(true)} className="btn-gradient !py-2.5 !px-4 text-sm flex items-center gap-2">
          <HiPlus className="w-4 h-4" /> Add Topic
        </button>
      </PageHeader>

      {/* Due Today */}
      <div className="mb-8">
        <h2 className="text-xl font-display font-bold text-surface-800 dark:text-white mb-4 flex items-center gap-2">
          <HiExclamationTriangle className="text-amber-500" /> Due for Revision ({dueToday.length})
        </h2>
        
        {dueToday.length === 0 ? (
          <div className="glass-card p-8 text-center text-surface-500">
            <HiCheck className="w-12 h-12 mx-auto text-emerald-500 mb-2 opacity-50" />
            <p>You're all caught up for today!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {dueToday.map(rev => (
                <motion.div key={rev._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card p-5 border-l-4 border-amber-500">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-surface-800 dark:text-white truncate pr-2">{rev.topic}</h3>
                    <button onClick={() => deleteRevision(rev._id)} className="text-xs text-surface-400 hover:text-red-500">Delete</button>
                  </div>
                  <p className="text-sm text-primary-500 font-medium mb-4">{rev.subject}</p>
                  
                  <p className="text-xs text-surface-500 mb-2 text-center">How well did you remember this?</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => handleLog(rev._id, 'hard')} className="py-2 text-xs font-semibold rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">Hard</button>
                    <button onClick={() => handleLog(rev._id, 'medium')} className="py-2 text-xs font-semibold rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400">Good</button>
                    <button onClick={() => handleLog(rev._id, 'easy')} className="py-2 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">Easy</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="text-xl font-display font-bold text-surface-800 dark:text-white mb-4 flex items-center gap-2">
          <HiClock className="text-primary-500" /> Upcoming ({upcoming.length})
        </h2>
        
        <div className="glass-card overflow-hidden">
          {upcoming.length === 0 ? (
            <p className="p-6 text-center text-surface-500">No upcoming revisions scheduled.</p>
          ) : (
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {upcoming.map(rev => {
                const daysLeft = Math.ceil((new Date(rev.nextRevisionDate) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={rev._id} className="p-4 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                    <div>
                      <p className="font-semibold text-surface-800 dark:text-white">{rev.topic}</p>
                      <p className="text-xs text-surface-400">{rev.subject}</p>
                    </div>
                    <div className="text-right">
                      <span className="badge bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300">
                        In {daysLeft} day{daysLeft > 1 ? 's' : ''}
                      </span>
                      <button onClick={() => deleteRevision(rev._id)} className="ml-4 text-surface-400 hover:text-red-500 text-sm">×</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Revision">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="floating-label">Topic</label>
            <input type="text" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="input-field" required placeholder="e.g. Binary Search Trees" />
          </div>
          <div>
            <label className="floating-label">Subject</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" required placeholder="e.g. Data Structures" />
          </div>
          <div>
            <label className="floating-label">First Revision Date</label>
            <input type="date" value={form.nextRevisionDate} onChange={(e) => setForm({ ...form, nextRevisionDate: e.target.value })} className="input-field" required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gradient">Schedule</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RevisionPage;
