import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiUserGroup, HiUsers, HiClipboardDocumentCheck } from 'react-icons/hi2';
import { useGroups } from '../hooks/useGroups';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const GroupsPage = () => {
  const { groups, loading, createGroup, joinGroup, addSharedTask, completeSharedTask } = useGroups();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  
  const [createForm, setCreateForm] = useState({ name: '', description: '' });
  const [joinCode, setJoinCode] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', deadline: '' });

  const handleCreate = async (e) => {
    e.preventDefault();
    await createGroup(createForm);
    setShowCreateModal(false);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    await joinGroup(joinCode);
    setShowJoinModal(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    await addSharedTask(activeGroup, taskForm);
    setShowTaskModal(false);
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
      <PageHeader title="Study Groups" subtitle="Collaborate with your classmates">
        <div className="flex gap-2">
          <button onClick={() => setShowJoinModal(true)} className="btn-outline !py-2.5 !px-4 text-sm flex items-center gap-2">Join</button>
          <button onClick={() => setShowCreateModal(true)} className="btn-gradient !py-2.5 !px-4 text-sm flex items-center gap-2"><HiPlus className="w-4 h-4" /> Create</button>
        </div>
      </PageHeader>

      {groups.length === 0 ? (
        <div className="glass-card p-12 text-center max-w-lg mx-auto">
          <HiUserGroup className="w-16 h-16 mx-auto text-primary-500/50 mb-4" />
          <h2 className="text-xl font-bold mb-2">No Groups Yet</h2>
          <p className="text-surface-500 mb-6">Create a study group or join an existing one using an invite code.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-4 lg:col-span-1">
            {groups.map(group => (
              <div key={group._id} onClick={() => setActiveGroup(group._id)} 
                className={`glass-card p-4 cursor-pointer transition-all border-2 ${activeGroup === group._id ? 'border-primary-500 shadow-md' : 'border-transparent hover:border-primary-300'}`}>
                <h3 className="font-bold text-surface-800 dark:text-white truncate">{group.name}</h3>
                <p className="text-xs text-surface-500 mt-1 flex items-center gap-1"><HiUsers className="w-3 h-3"/> {group.members.length} members</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {activeGroup ? (() => {
              const group = groups.find(g => g._id === activeGroup);
              return (
                <div className="glass-card p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start border-b border-surface-200 dark:border-surface-700 pb-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-surface-800 dark:text-white">{group.name}</h2>
                      <p className="text-sm text-surface-500 mt-1">{group.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-surface-400 uppercase font-semibold tracking-wider">Invite Code</p>
                      <p className="text-xl font-mono font-bold text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-lg mt-1">{group.inviteCode}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-surface-700 dark:text-surface-300">Shared Tasks</h3>
                    <button onClick={() => setShowTaskModal(true)} className="text-sm text-primary-500 font-semibold hover:underline">+ Add Task</button>
                  </div>

                  <div className="space-y-3 overflow-y-auto flex-1">
                    {group.sharedTasks.length === 0 ? <p className="text-sm text-surface-400">No shared tasks yet.</p> : (
                      group.sharedTasks.map(task => (
                        <div key={task._id} className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/50 flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-surface-800 dark:text-white">{task.title}</p>
                            <p className="text-xs text-surface-500 mt-1">Completed by {task.completedBy.length}/{group.members.length}</p>
                          </div>
                          <button onClick={() => completeSharedTask(group._id, task._id)} 
                            className="p-2 rounded-lg bg-surface-200 hover:bg-emerald-100 hover:text-emerald-600 dark:bg-surface-700 transition-colors">
                            <HiClipboardDocumentCheck className="w-5 h-5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })() : (
              <div className="glass-card p-12 text-center h-full flex flex-col justify-center text-surface-500">Select a group to view details</div>
            )}
          </div>
        </div>
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Study Group">
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div><label className="floating-label">Group Name</label><input type="text" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} className="input-field" required /></div>
          <div><label className="floating-label">Description (Optional)</label><textarea value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} className="input-field resize-none" rows={3} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCreateModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gradient">Create</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Join Group">
        <form onSubmit={handleJoin} className="p-6 space-y-4">
          <div><label className="floating-label">Enter Invite Code</label><input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} className="input-field font-mono text-center tracking-widest text-lg uppercase" required placeholder="XXXX" maxLength={8} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowJoinModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gradient">Join</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Add Shared Task">
        <form onSubmit={handleAddTask} className="p-6 space-y-4">
          <div><label className="floating-label">Task Title</label><input type="text" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className="input-field" required /></div>
          <div><label className="floating-label">Deadline</label><input type="date" value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} className="input-field" required /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowTaskModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gradient">Add Task</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GroupsPage;
