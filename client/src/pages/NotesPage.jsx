import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencilSquare, HiTrash, HiDocumentText, HiMagnifyingGlass, HiBookmarkSlash, HiBookmark } from 'react-icons/hi2';
import { useNotes } from '../hooks/useNotes';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const NotesPage = () => {
  const { notes, loading, fetchNotes, createNote, updateNote, deleteNote, togglePin } = useNotes();
  const [showModal, setShowModal] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', content: '', subject: '', tags: [] });
  const [tagInput, setTagInput] = useState('');

  const openCreate = () => { setEditNote(null); setForm({ title: '', content: '', subject: '', tags: [] }); setShowModal(true); };
  const openEdit = (n) => {
    setEditNote(n);
    setForm({ title: n.title, content: n.content, subject: n.subject || '', tags: n.tags || [] });
    setShowModal(true);
  };

  const handleSearch = (val) => { setSearch(val); fetchNotes({ search: val }); };
  const addTag = () => { if (!tagInput.trim()) return; setForm({ ...form, tags: [...form.tags, tagInput.trim()] }); setTagInput(''); };
  const removeTag = (i) => setForm({ ...form, tags: form.tags.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editNote) await updateNote(editNote._id, form);
    else await createNote(form);
    setShowModal(false);
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" text="Loading notes..." /></div>;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
      <PageHeader title="Notes" subtitle="Capture and organize your study notes">
        <button onClick={openCreate} className="btn-gradient !py-2.5 !px-4 text-sm flex items-center gap-2" id="add-note-btn">
          <HiPlus className="w-4 h-4" /> New Note
        </button>
      </PageHeader>

      {/* Search */}
      <div className="glass-card p-4 mb-6">
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search notes..." className="input-field !pl-10 !py-2.5" />
        </div>
      </div>

      {notes.length === 0 ? (
        <EmptyState icon={HiDocumentText} title="No notes yet" message="Start taking notes to remember key concepts" actionLabel="Create Note" onAction={openCreate} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div key={note._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                whileHover={{ y: -4 }} className="glass-card p-5 flex flex-col cursor-default">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display font-bold text-surface-800 dark:text-white line-clamp-1 flex-1">{note.title}</h3>
                  <button onClick={() => togglePin(note._id)} className="p-1 text-surface-400 hover:text-amber-500 transition-colors flex-shrink-0">
                    {note.isPinned ? <HiBookmark className="w-4 h-4 text-amber-500" /> : <HiBookmarkSlash className="w-4 h-4" />}
                  </button>
                </div>
                {note.subject && <span className="text-xs text-primary-500 font-medium mb-2">📚 {note.subject}</span>}
                <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-4 flex-1 whitespace-pre-wrap">{note.content || 'No content'}</p>
                {note.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {note.tags.map((tag, i) => <span key={i} className="badge bg-surface-100 dark:bg-surface-800 text-surface-500 text-xs">#{tag}</span>)}
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-100 dark:border-surface-800">
                  <span className="text-xs text-surface-400">{new Date(note.updatedAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(note)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-500 transition-all">
                      <HiPencilSquare className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(note._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-all">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editNote ? 'Edit Note' : 'New Note'} icon={HiDocumentText} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="floating-label">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Note title..." className="input-field" required />
          </div>
          <div>
            <label className="floating-label">Subject (optional)</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Data Structures" className="input-field" />
          </div>
          <div>
            <label className="floating-label">Content</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your notes here... (supports basic formatting)" rows={10} className="input-field resize-none font-mono text-sm" />
          </div>
          <div>
            <label className="floating-label">Tags</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag..." className="input-field flex-1"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
              <button type="button" onClick={addTag} className="btn-outline !py-2 !px-3"><HiPlus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((t, i) => (
                <span key={i} className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  #{t} <button type="button" onClick={() => removeTag(i)} className="ml-1 hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-gradient">{editNote ? 'Update' : 'Create'} Note</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteNote(deleteId); setDeleteId(null); }} title="Delete Note" message="This note will be permanently deleted." />
    </div>
  );
};

export default NotesPage;
