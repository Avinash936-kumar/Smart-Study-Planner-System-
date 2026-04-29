import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiTrash, HiCheckCircle, HiXCircle } from 'react-icons/hi2';
import { useAttendance } from '../hooks/useAttendance';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const AttendancePage = () => {
  const { attendance, loading, createAttendance, updateAttendance, deleteAttendance } = useAttendance();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subject: '', minimumPercentage: 75 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAttendance(form);
    setShowModal(false);
    setForm({ subject: '', minimumPercentage: 75 });
  };

  const markAttendance = async (id, subject, total, attended, isPresent) => {
    await updateAttendance(id, {
      totalClasses: total + 1,
      attendedClasses: isPresent ? attended + 1 : attended
    });
  };

  const calculateSafeToBunk = (total, attended, required) => {
    const req = required / 100;
    // (attended) / (total + x) = req => x = (attended / req) - total
    let safe = Math.floor((attended / req) - total);
    return safe > 0 ? safe : 0;
  };

  const calculateClassesToAttend = (total, attended, required) => {
    const req = required / 100;
    // (attended + y) / (total + y) = req => y = (req * total - attended) / (1 - req)
    let needed = Math.ceil((req * total - attended) / (1 - req));
    return needed > 0 ? needed : 0;
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
      <PageHeader title="Attendance Tracker" subtitle="Never fall below your required percentage">
        <button onClick={() => setShowModal(true)} className="btn-gradient !py-2.5 !px-4 text-sm flex items-center gap-2">
          <HiPlus className="w-4 h-4" /> Add Subject
        </button>
      </PageHeader>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {attendance.map((item) => {
            const isSafe = item.percentage >= item.minimumPercentage;
            const safeBunk = calculateSafeToBunk(item.totalClasses, item.attendedClasses, item.minimumPercentage);
            const neededAttend = calculateClassesToAttend(item.totalClasses, item.attendedClasses, item.minimumPercentage);

            return (
              <motion.div key={item._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className={`glass-card p-6 border-t-4 ${isSafe ? 'border-emerald-500' : 'border-red-500'}`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display font-bold text-lg text-surface-800 dark:text-white truncate pr-2">{item.subject}</h3>
                  <button onClick={() => deleteAttendance(item._id)} className="text-surface-400 hover:text-red-500 transition-colors">
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-100 dark:text-surface-800" />
                      <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" stroke="currentColor" strokeLinecap="round"
                        className={isSafe ? 'text-emerald-500' : 'text-red-500'}
                        strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - item.percentage / 100)}`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">{item.percentage}%</div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm text-surface-500">Attended: <span className="font-bold text-surface-800 dark:text-white">{item.attendedClasses}</span></p>
                    <p className="text-sm text-surface-500">Total: <span className="font-bold text-surface-800 dark:text-white">{item.totalClasses}</span></p>
                    <p className="text-xs text-surface-400">Target: {item.minimumPercentage}%</p>
                  </div>
                </div>

                <div className="mb-6 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 text-center text-sm font-medium">
                  {item.totalClasses === 0 ? (
                    <span className="text-surface-500">No classes yet</span>
                  ) : isSafe ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Safe to bunk {safeBunk} classes 😎</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">Must attend next {neededAttend} classes 🚨</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => markAttendance(item._id, item.subject, item.totalClasses, item.attendedClasses, true)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 font-semibold transition-colors flex items-center justify-center gap-1">
                    <HiCheckCircle className="w-5 h-5" /> Present
                  </button>
                  <button onClick={() => markAttendance(item._id, item.subject, item.totalClasses, item.attendedClasses, false)}
                    className="flex-1 py-2.5 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 font-semibold transition-colors flex items-center justify-center gap-1">
                    <HiXCircle className="w-5 h-5" /> Absent
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Track New Subject">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="floating-label">Subject Name</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="floating-label">Required Percentage (%)</label>
            <input type="number" value={form.minimumPercentage} onChange={(e) => setForm({ ...form, minimumPercentage: parseInt(e.target.value) })} min="1" max="100" className="input-field" required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gradient">Add Subject</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AttendancePage;
