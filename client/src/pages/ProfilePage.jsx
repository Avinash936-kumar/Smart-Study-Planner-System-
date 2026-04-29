import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  HiEnvelope, HiCalendarDays, HiPencilSquare, HiTrash, 
  HiAcademicCap, HiClock, HiBolt, HiUserCircle, 
  HiPresentationChartLine, HiCog6Tooth, HiShieldCheck, HiArrowDownTray
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [form, setForm] = useState({
    name: user?.name || '', 
    bio: user?.bio || '', 
    course: user?.course || '',
    semester: user?.semester || '', 
    dailyStudyTarget: user?.dailyStudyTarget || 4,
    preferredStudyTime: user?.preferredStudyTime || 'evening', 
    pomodoroMinutes: user?.pomodoroMinutes || 25,
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: HiUserCircle },
    { id: 'academic', label: 'Academic', icon: HiAcademicCap },
    { id: 'preferences', label: 'Preferences', icon: HiCog6Tooth },
    { id: 'data', label: 'Data & Privacy', icon: HiShieldCheck },
  ];

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile(form);
    setLoading(false);
    if (result.success) {
      setEditing(false);
      toast.success('Profile updated!');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/auth/account');
      toast.success('Account deleted');
      logout();
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 lg:pb-10 overflow-y-auto mesh-gradient">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-display font-black text-surface-900 dark:text-white">Settings</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Manage your identity and learning preferences</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Settings Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                      : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-6 sm:p-8"
              >
                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-surface-100 dark:border-surface-800">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-surface-800 shadow-lg flex items-center justify-center border border-surface-100 dark:border-surface-700">
                          <HiPencilSquare className="w-4 h-4 text-primary-500" />
                        </div>
                      </div>
                      <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-black text-surface-900 dark:text-white">{user?.name}</h2>
                        <p className="text-surface-500 flex items-center justify-center sm:justify-start gap-2 mt-1">
                          <HiEnvelope className="w-4 h-4" /> {user?.email}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                           <span className="px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase">Level {user?.level || 1}</span>
                           <span className="text-xs text-surface-400 font-medium italic">Member since {memberSince}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-surface-500 uppercase tracking-widest">Full Name</label>
                        <input 
                          type="text" 
                          value={form.name} 
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="input-field" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-surface-500 uppercase tracking-widest">Email Address</label>
                        <input type="email" value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed" />
                      </div>
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-black text-surface-500 uppercase tracking-widest">Bio / Motto</label>
                        <textarea 
                          value={form.bio} 
                          onChange={(e) => setForm({ ...form, bio: e.target.value })}
                          rows={3}
                          className="input-field resize-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button onClick={handleSave} disabled={loading} className="btn-gradient min-w-[140px]">
                        {loading ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Academic Tab */}
                {activeTab === 'academic' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <HiAcademicCap className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-surface-900 dark:text-white">Academic Profile</h3>
                        <p className="text-sm text-surface-500">How you study and what you're learning</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-surface-500 uppercase tracking-widest">Current Course</label>
                        <input type="text" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="e.g. B.Tech Computer Science" className="input-field" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-surface-500 uppercase tracking-widest">Current Semester</label>
                        <input type="text" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} placeholder="e.g. 6th Semester" className="input-field" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-surface-500 uppercase tracking-widest">Daily Study Target (Hrs)</label>
                        <input type="number" value={form.dailyStudyTarget} onChange={(e) => setForm({ ...form, dailyStudyTarget: parseInt(e.target.value) })} className="input-field" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-surface-500 uppercase tracking-widest">Preferred Study Time</label>
                        <select value={form.preferredStudyTime} onChange={(e) => setForm({ ...form, preferredStudyTime: e.target.value })} className="input-field">
                          <option value="morning">Early Morning</option>
                          <option value="afternoon">Afternoon</option>
                          <option value="evening">Evening</option>
                          <option value="night">Late Night</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button onClick={handleSave} className="btn-gradient min-w-[140px]">Save Changes</button>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                        <HiCog6Tooth className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-surface-900 dark:text-white">System Preferences</h3>
                        <p className="text-sm text-surface-500">Customize your app experience</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
                            <HiBolt className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-surface-900 dark:text-white">Interface Theme</p>
                            <p className="text-xs text-surface-500">Switch between light and dark mode</p>
                          </div>
                        </div>
                        <ThemeToggle />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-accent-500 text-white flex items-center justify-center">
                            <HiClock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-surface-900 dark:text-white">Pomodoro Timer</p>
                            <p className="text-xs text-surface-500">Default session length (minutes)</p>
                          </div>
                        </div>
                        <input 
                          type="number" 
                          value={form.pomodoroMinutes} 
                          onChange={(e) => setForm({ ...form, pomodoroMinutes: parseInt(e.target.value) })}
                          className="w-20 input-field !py-2 text-center" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Data & Privacy Tab */}
                {activeTab === 'data' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <HiShieldCheck className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-surface-900 dark:text-white">Data & Privacy</h3>
                        <p className="text-sm text-surface-500">Manage your stored information</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-5 rounded-2xl bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800/50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <HiArrowDownTray className="w-6 h-6 text-primary-600 mt-1" />
                            <div>
                              <h4 className="font-bold text-surface-900 dark:text-white">Export Your Data</h4>
                              <p className="text-sm text-surface-500 mt-1">Download all your tasks, attendance, and academic data in a portable JSON file.</p>
                            </div>
                          </div>
                          <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/export`} download className="btn-gradient !py-2 !px-4 text-xs whitespace-nowrap">
                            Export JSON
                          </a>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <HiTrash className="w-6 h-6 text-red-600 mt-1" />
                            <div>
                              <h4 className="font-bold text-red-600 dark:text-red-400">Terminate Account</h4>
                              <p className="text-sm text-surface-500 mt-1">Permanently remove your account and all associated data. This action is irreversible.</p>
                            </div>
                          </div>
                          <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors whitespace-nowrap">
                            Delete Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <ConfirmDialog 
          isOpen={showDeleteConfirm} 
          onClose={() => setShowDeleteConfirm(false)} 
          onConfirm={handleDeleteAccount}
          title="Irreversible Action" 
          message="This will wipe all your academic data, XP, and settings. Are you absolutely sure?" 
          confirmLabel="Delete Everything" 
        />
      </div>
    </div>
  );
};

export default ProfilePage;

