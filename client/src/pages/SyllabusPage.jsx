import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlus, HiTrash, HiCheckCircle, HiChevronDown } from 'react-icons/hi2';
import { useSyllabus } from '../hooks/useSyllabus';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const SyllabusPage = () => {
  const { syllabus, loading, createSyllabus, updateSyllabus, deleteSyllabus } = useSyllabus();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subject: '', units: [] });
  const [expandedSubject, setExpandedSubject] = useState(null);

  const handleAddUnit = () => setForm({ ...form, units: [...form.units, { unitName: `Unit ${form.units.length + 1}`, topics: [] }] });
  
  const handleAddTopicToForm = (unitIndex) => {
    const newUnits = [...form.units];
    newUnits[unitIndex].topics.push({ title: 'New Topic', completed: false });
    setForm({ ...form, units: newUnits });
  };

  const handleTopicTitleChange = (unitIndex, topicIndex, title) => {
    const newUnits = [...form.units];
    newUnits[unitIndex].topics[topicIndex].title = title;
    setForm({ ...form, units: newUnits });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createSyllabus(form);
    setShowModal(false);
    setForm({ subject: '', units: [] });
  };

  const toggleTopic = async (subjectId, subjectObj, unitIndex, topicIndex) => {
    const newUnits = [...subjectObj.units];
    newUnits[unitIndex].topics[topicIndex].completed = !newUnits[unitIndex].topics[topicIndex].completed;
    await updateSyllabus(subjectId, { units: newUnits });
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
      <PageHeader title="Syllabus Tracker" subtitle="Break down and conquer your coursework">
        <button onClick={() => setShowModal(true)} className="btn-gradient !py-2.5 !px-4 text-sm flex items-center gap-2">
          <HiPlus className="w-4 h-4" /> Add Syllabus
        </button>
      </PageHeader>

      <div className="space-y-4">
        {syllabus.map((sub) => (
          <div key={sub._id} className="glass-card overflow-hidden">
            <div className="p-4 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
              onClick={() => setExpandedSubject(expandedSubject === sub._id ? null : sub._id)}>
              <div className="flex-1 flex items-center gap-4">
                <button className={`p-2 rounded-lg transition-transform ${expandedSubject === sub._id ? 'rotate-180 bg-surface-100 dark:bg-surface-700' : ''}`}>
                  <HiChevronDown className="w-5 h-5 text-surface-500" />
                </button>
                <div>
                  <h3 className="font-display font-bold text-lg text-surface-800 dark:text-white">{sub.subject}</h3>
                  <p className="text-sm text-surface-400">{sub.units.length} Units</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <span className="text-sm font-semibold text-primary-500">{sub.completionPercentage}% Done</span>
                  <div className="w-32 h-2 bg-surface-200 dark:bg-surface-700 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary-500" style={{ width: `${sub.completionPercentage}%` }} />
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteSyllabus(sub._id); }} className="p-2 text-surface-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>
            </div>

            {expandedSubject === sub._id && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-surface-100 dark:border-surface-800 p-4 sm:p-6 bg-surface-50/50 dark:bg-surface-900/50">
                {sub.units.map((unit, uIdx) => (
                  <div key={unit._id} className="mb-6 last:mb-0">
                    <h4 className="font-semibold text-surface-700 dark:text-surface-300 mb-3">{unit.unitName}</h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {unit.topics.map((topic, tIdx) => (
                        <div key={topic._id} onClick={() => toggleTopic(sub._id, sub, uIdx, tIdx)}
                          className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                            topic.completed ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50' : 'bg-white border-surface-200 dark:bg-surface-800 dark:border-surface-700 hover:border-primary-300'
                          }`}>
                          <HiCheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${topic.completed ? 'text-emerald-500' : 'text-surface-300'}`} />
                          <span className={`text-sm ${topic.completed ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-surface-600 dark:text-surface-300'}`}>{topic.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Syllabus" maxWidth="max-w-3xl">
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="mb-6">
            <label className="floating-label">Subject</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" required placeholder="e.g. Operating Systems" />
          </div>

          <div className="space-y-6">
            {form.units.map((unit, uIdx) => (
              <div key={uIdx} className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                <input type="text" value={unit.unitName} onChange={(e) => { const newU = [...form.units]; newU[uIdx].unitName = e.target.value; setForm({ ...form, units: newU }); }} className="input-field mb-3" />
                <div className="space-y-2 mb-3">
                  {unit.topics.map((topic, tIdx) => (
                    <div key={tIdx} className="flex gap-2">
                      <input type="text" value={topic.title} onChange={(e) => handleTopicTitleChange(uIdx, tIdx, e.target.value)} className="input-field !py-2 text-sm" placeholder="Topic title" />
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => handleAddTopicToForm(uIdx)} className="text-sm text-primary-500 font-medium hover:text-primary-600">+ Add Topic</button>
              </div>
            ))}
          </div>

          <div className="mt-4 pb-6 border-b border-surface-200 dark:border-surface-700">
            <button type="button" onClick={handleAddUnit} className="btn-outline w-full !py-2">Add Unit</button>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gradient">Save Syllabus</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SyllabusPage;
