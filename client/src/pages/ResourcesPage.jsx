import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowUpTray, HiLink, HiDocumentText, HiTrash, HiMagnifyingGlass, HiBookmarkSlash, HiBookmark } from 'react-icons/hi2';
import { useResources } from '../hooks/useResources';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const ResourcesPage = () => {
  const { resources, loading, createResource, deleteResource, togglePin, fetchResources } = useResources();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', subject: '', type: 'link', data: '', tags: [] });
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSearch = (val) => { setSearch(val); fetchResources({ search: val }); };
  const addTag = () => { if (!tagInput.trim()) return; setForm({ ...form, tags: [...form.tags, tagInput.trim()] }); setTagInput(''); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // File size limit: 2MB for base64 storage
    if (file.size > 2 * 1024 * 1024) {
      alert("File too large. Please select a file under 2MB for MongoDB storage.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, type: 'file', data: reader.result, title: form.title || file.name.split('.')[0] });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    await createResource(form);
    setUploading(false);
    setShowModal(false);
    setForm({ title: '', subject: '', type: 'link', data: '', tags: [] });
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
      <PageHeader title="Resources Library" subtitle="Store and organize important links and files">
        <button onClick={() => setShowModal(true)} className="btn-gradient !py-2.5 !px-4 text-sm flex items-center gap-2">
          <HiArrowUpTray className="w-4 h-4" /> Add Resource
        </button>
      </PageHeader>

      <div className="glass-card p-4 mb-6 relative">
        <HiMagnifyingGlass className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
        <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search resources..." className="input-field !pl-10 !py-2.5" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {resources.map((res) => (
            <motion.div key={res._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="glass-card p-5 flex flex-col group">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-surface-100 dark:bg-surface-800 rounded-lg text-primary-500">
                  {res.type === 'link' ? <HiLink className="w-6 h-6" /> : <HiDocumentText className="w-6 h-6" />}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => togglePin(res._id)} className="p-1 text-surface-400 hover:text-amber-500">
                    {res.isPinned ? <HiBookmark className="w-5 h-5 text-amber-500" /> : <HiBookmarkSlash className="w-5 h-5" />}
                  </button>
                  <button onClick={() => deleteResource(res._id)} className="p-1 text-surface-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-surface-800 dark:text-white line-clamp-2 mb-1">{res.title}</h3>
              {res.subject && <p className="text-xs font-semibold text-primary-500 mb-3">{res.subject}</p>}
              
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="flex gap-1 flex-wrap flex-1">
                  {res.tags?.map((tag, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300">#{tag}</span>)}
                </div>
                {res.type === 'link' ? (
                  <a href={res.data} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary-500 hover:text-primary-600 ml-2">Visit →</a>
                ) : (
                  <a href={res.data} download={res.title} className="text-sm font-semibold text-emerald-500 hover:text-emerald-600 ml-2">Download ↓</a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Resource">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-4 mb-4">
            <button type="button" onClick={() => setForm({ ...form, type: 'link', data: '' })} className={`flex-1 py-2 text-sm font-semibold rounded-xl border-2 ${form.type === 'link' ? 'border-primary-500 text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-surface-200 dark:border-surface-700 text-surface-500'}`}>Link</button>
            <button type="button" onClick={() => setForm({ ...form, type: 'file', data: '' })} className={`flex-1 py-2 text-sm font-semibold rounded-xl border-2 ${form.type === 'file' ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'border-surface-200 dark:border-surface-700 text-surface-500'}`}>File Upload</button>
          </div>

          <div>
            <label className="floating-label">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          </div>
          
          <div>
            <label className="floating-label">Subject (Optional)</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" />
          </div>

          {form.type === 'link' ? (
            <div>
              <label className="floating-label">URL</label>
              <input type="url" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} className="input-field" required placeholder="https://..." />
            </div>
          ) : (
            <div>
              <label className="floating-label">File (Max 2MB)</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" required />
            </div>
          )}

          <div>
            <label className="floating-label">Tags</label>
            <div className="flex gap-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} className="input-field flex-1" placeholder="Add tag..." />
              <button type="button" onClick={addTag} className="btn-outline !py-2 !px-3">+</button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {form.tags.map((t, i) => <span key={i} className="text-xs px-2 py-1 bg-surface-100 rounded-full">{t}</span>)}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={uploading} className="btn-gradient">{uploading ? 'Saving...' : 'Save Resource'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ResourcesPage;
