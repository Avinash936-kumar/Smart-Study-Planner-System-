import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencilSquare, HiTrash, HiAcademicCap, HiCheckCircle, HiClock, HiExclamationTriangle } from 'react-icons/hi2';
import { useExams } from '../hooks/useExams';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const statusColors = {
  'not-started': 'badge-pending',
  'in-progress': 'badge-in-progress',
  'revision': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'ready': 'badge-completed',
};

const ExamsPage = () => {
  const { exams, loading, createExam, updateExam, deleteExam, generateRevisionPlan } = useExams();
  const [showModal, setShowModal] = useState(false);
  const [editExam, setEditExam] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [revisionPlan, setRevisionPlan] = useState(null);
  const [form, setForm] = useState({ name: '', subject: '', examDate: '', priority: 'medium', preparationStatus: 'not-started', notes: '', syllabus: [] });
  const [newTopic, setNewTopic] = useState('');

  const openCreate = () => { setEditExam(null); setForm({ name: '', subject: '', examDate: '', priority: 'medium', preparationStatus: 'not-started', notes: '', syllabus: [] }); setShowModal(true); };
  const openEdit = (e) => {
    setEditExam(e);
    setForm({ name: e.name, subject: e.subject, examDate: e.examDate ? new Date(e.examDate).toISOString().split('T')[0] : '', priority: e.priority, preparationStatus: e.preparationStatus, notes: e.notes || '', syllabus: e.syllabus || [] });
    setShowModal(true);
  };

  const addTopic = () => { if (!newTopic.trim()) return; setForm({ ...form, syllabus: [...form.syllabus, { title: newTopic.trim(), completed: false }] }); setNewTopic(''); };
  const toggleTopic = (i) => { const s = [...form.syllabus]; s[i].completed = !s[i].completed; setForm({ ...form, syllabus: s }); };
  const removeTopic = (i) => { setForm({ ...form, syllabus: form.syllabus.filter((_, idx) => idx !== i) }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.subject.trim() || !form.examDate) return;
    if (editExam) await updateExam(editExam._id, form);
    else await createExam(form);
    setShowModal(false);
  };

  const handleToggleSyllabus = async (examId, exam, topicIndex) => {
    const updatedSyllabus = [...exam.syllabus];
    updatedSyllabus[topicIndex] = { ...updatedSyllabus[topicIndex], completed: !updatedSyllabus[topicIndex].completed };
    await updateExam(examId, { syllabus: updatedSyllabus });
  };

  const handleRevisionPlan = async (id) => {
    const result = await generateRevisionPlan(id);
    if (result.success) setRevisionPlan(result.data);
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" text="Loading exams..." /></div>;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
      <PageHeader title="Exam Planner" subtitle="Track your exams and preparation progress">
        <button onClick={openCreate} className="btn-gradient !py-2.5 !px-4 text-sm flex items-center gap-2" id="add-exam-btn">
          <HiPlus className="w-4 h-4" /> Add Exam
        </button>
      </PageHeader>

      {exams.length === 0 ? (
        <EmptyState icon={HiAcademicCap} title="No exams yet" message="Add upcoming exams to track preparation and deadlines" actionLabel="Add Exam" onAction={openCreate} />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {exams.map((exam) => (
              <motion.div key={exam._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`glass-card p-5 ${exam.isUrgent ? 'ring-2 ring-red-400/50' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`badge ${statusColors[exam.preparationStatus]}`}>{exam.preparationStatus.replace('-', ' ')}</span>
                      {exam.isUrgent && <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1"><HiExclamationTriangle className="w-3 h-3" /> Urgent</span>}
                      {exam.isPast && <span className="badge bg-surface-200 text-surface-500">Past</span>}
                    </div>
                    <h3 className="font-display font-bold text-lg text-surface-800 dark:text-white">{exam.name}</h3>
                    <p className="text-sm text-surface-400">📚 {exam.subject}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleRevisionPlan(exam._id)} className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-surface-400 hover:text-primary-500 transition-all" title="Generate Revision Plan">
                      <HiClock className="w-4 h-4" />
                    </button>
                    <button onClick={() => openEdit(exam)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-500 transition-all">
                      <HiPencilSquare className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(exam._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-all">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Countdown + Progress */}
                <div className="flex items-center gap-6 mb-3">
                  <div className="text-center">
                    <p className={`text-2xl font-display font-bold ${exam.daysLeft <= 3 ? 'text-red-500' : exam.daysLeft <= 7 ? 'text-amber-500' : 'text-primary-500'}`}>
                      {exam.isPast ? '—' : exam.daysLeft}
                    </p>
                    <p className="text-xs text-surface-400">{exam.isPast ? 'Past' : 'days left'}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-surface-400">Syllabus Progress</span>
                      <span className="font-semibold text-primary-500">{exam.syllabusProgress}%</span>
                    </div>
                    <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all" style={{ width: `${exam.syllabusProgress}%` }} />
                    </div>
                  </div>
                </div>

                {/* Syllabus checklist */}
                {exam.syllabus?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exam.syllabus.map((topic, i) => (
                      <button key={i} onClick={() => handleToggleSyllabus(exam._id, exam, i)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${topic.completed ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200'}`}>
                        <HiCheckCircle className={`w-3.5 h-3.5 ${topic.completed ? 'text-emerald-500' : 'text-surface-300'}`} />
                        {topic.title}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Revision Plan Modal */}
      <Modal isOpen={!!revisionPlan} onClose={() => setRevisionPlan(null)} title="Revision Plan" icon={HiClock}>
        <div className="p-6 space-y-3">
          {revisionPlan?.length === 0 ? <p className="text-surface-400 text-center py-4">All topics completed! 🎉</p> : revisionPlan?.map((day, i) => (
            <div key={i} className="glass-card p-4">
              <p className="font-semibold text-surface-800 dark:text-white text-sm">{day.day}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {day.topics.map((t, j) => <span key={j} className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editExam ? 'Edit Exam' : 'Add Exam'} icon={HiAcademicCap}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="floating-label">Exam Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. DSA Mid-Term" className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="floating-label">Subject</label>
              <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Data Structures" className="input-field" required />
            </div>
            <div>
              <label className="floating-label">Exam Date</label>
              <input type="date" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} className="input-field" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="floating-label">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field">
                <option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option>
              </select>
            </div>
            <div>
              <label className="floating-label">Preparation Status</label>
              <select value={form.preparationStatus} onChange={(e) => setForm({ ...form, preparationStatus: e.target.value })} className="input-field">
                <option value="not-started">Not Started</option><option value="in-progress">In Progress</option><option value="revision">Revision</option><option value="ready">Ready</option>
              </select>
            </div>
          </div>
          <div>
            <label className="floating-label">Syllabus Topics</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="Add a topic..." className="input-field flex-1"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTopic(); } }} />
              <button type="button" onClick={addTopic} className="btn-outline !py-2 !px-3"><HiPlus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.syllabus.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-sm">
                  <button type="button" onClick={() => toggleTopic(i)}><HiCheckCircle className={`w-4 h-4 ${t.completed ? 'text-emerald-500' : 'text-surface-300'}`} /></button>
                  {t.title}
                  <button type="button" onClick={() => removeTopic(i)} className="text-surface-400 hover:text-red-500 ml-1">×</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gradient">{editExam ? 'Update' : 'Create'} Exam</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteExam(deleteId); setDeleteId(null); }} />
    </div>
  );
};

export default ExamsPage;
