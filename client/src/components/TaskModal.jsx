import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiSparkles } from 'react-icons/hi2';

const TaskModal = ({ isOpen, onClose, onSubmit, editTask = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    deadline: '',
    priority: 'medium',
    estimatedHours: 1,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title || '',
        subject: editTask.subject || '',
        description: editTask.description || '',
        deadline: editTask.deadline
          ? new Date(editTask.deadline).toISOString().split('T')[0]
          : '',
        priority: editTask.priority || 'medium',
        estimatedHours: editTask.estimatedHours || 1,
      });
    } else {
      setFormData({
        title: '',
        subject: '',
        description: '',
        deadline: '',
        priority: 'medium',
        estimatedHours: 1,
      });
    }
    setErrors({});
  }, [editTask, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 dark:border-surface-800">
              <div className="flex items-center gap-2">
                <HiSparkles className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-display font-bold text-surface-900 dark:text-white">
                  {editTask ? 'Edit Task' : 'Create New Task'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                id="task-modal-close"
              >
                <HiXMark className="w-5 h-5 text-surface-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="floating-label">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Complete Data Structures Assignment"
                  className={`input-field ${errors.title ? 'border-red-400 focus:ring-red-400' : ''}`}
                  id="task-title-input"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Subject + Priority row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="floating-label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    className={`input-field ${errors.subject ? 'border-red-400 focus:ring-red-400' : ''}`}
                    id="task-subject-input"
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
                  )}
                </div>
                <div>
                  <label className="floating-label">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input-field"
                    id="task-priority-select"
                  >
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>

              {/* Deadline + Estimated Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="floating-label">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={`input-field ${errors.deadline ? 'border-red-400 focus:ring-red-400' : ''}`}
                    id="task-deadline-input"
                  />
                  {errors.deadline && (
                    <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>
                  )}
                </div>
                <div>
                  <label className="floating-label">Est. Hours</label>
                  <input
                    type="number"
                    name="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={handleChange}
                    min="0.25"
                    max="24"
                    step="0.25"
                    className="input-field"
                    id="task-hours-input"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="floating-label">Description (optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add details about this task..."
                  rows={3}
                  className="input-field resize-none"
                  id="task-description-input"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gradient" id="task-submit-btn">
                  {editTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
