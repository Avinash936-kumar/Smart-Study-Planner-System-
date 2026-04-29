import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiBolt, HiPlay, HiPause, HiArrowPath, HiCheckCircle } from 'react-icons/hi2';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFocus } from '../hooks/useFocus';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import ChartCard from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';

const FocusPage = () => {
  const { user } = useAuth();
  const { stats, loading, fetchStats, saveSession } = useFocus();
  const pomodoroMinutes = user?.pomodoroMinutes || 25;
  const breakMinutes = 5;

  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const [timeLeft, setTimeLeft] = useState(pomodoroMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [subject, setSubject] = useState('');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
      if (mode === 'focus') {
        // Save session
        saveSession({ subject, duration: pomodoroMinutes, type: 'pomodoro' });
        setSessionsCompleted((s) => s + 1);
        // Switch to break
        setMode('break');
        setTimeLeft(breakMinutes * 60);
      } else {
        // Break done, back to focus
        setMode('focus');
        setTimeLeft(pomodoroMinutes * 60);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setMode('focus');
    setTimeLeft(pomodoroMinutes * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalSeconds = mode === 'focus' ? pomodoroMinutes * 60 : breakMinutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
      <PageHeader title="Focus Timer" subtitle="Stay focused with the Pomodoro technique" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Timer */}
        <div className="glass-card p-8 text-center">
          <div className="mb-6">
            <span className={`badge ${mode === 'focus' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
              {mode === 'focus' ? '🎯 Focus Time' : '☕ Break Time'}
            </span>
          </div>

          {/* Circular Timer */}
          <div className="relative w-56 h-56 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="6" className="text-surface-100 dark:text-surface-800" />
              <circle cx="100" cy="100" r="90" fill="none" strokeWidth="6"
                className={mode === 'focus' ? 'text-primary-500' : 'text-emerald-500'}
                stroke="currentColor" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-5xl font-display font-bold text-surface-900 dark:text-white font-mono">{formatTime(timeLeft)}</p>
              <p className="text-sm text-surface-400 mt-1">Session {sessionsCompleted + 1}</p>
            </div>
          </div>

          {/* Subject Input */}
          <div className="mb-6 max-w-xs mx-auto">
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="What are you studying?" className="input-field text-center" disabled={isRunning} />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={resetTimer}
              className="p-3 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all" title="Reset">
              <HiArrowPath className="w-5 h-5 text-surface-500" />
            </button>
            <button onClick={toggleTimer}
              className={`p-5 rounded-2xl text-white shadow-lg transition-all hover:scale-105 ${
                mode === 'focus' ? 'bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-neon' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}>
              {isRunning ? <HiPause className="w-8 h-8" /> : <HiPlay className="w-8 h-8" />}
            </button>
            <div className="p-3 rounded-xl bg-surface-100 dark:bg-surface-800">
              <div className="flex items-center gap-1">
                <HiCheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-surface-800 dark:text-white">{sessionsCompleted}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {/* Today's Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-5 text-center">
              <p className="text-3xl font-display font-bold text-primary-500">{stats?.todayMinutes || 0}</p>
              <p className="text-xs text-surface-400 mt-1">Minutes Today</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-3xl font-display font-bold text-accent-500">{stats?.weekMinutes || 0}</p>
              <p className="text-xs text-surface-400 mt-1">Minutes This Week</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-3xl font-display font-bold text-emerald-500">{stats?.todaySessions || 0}</p>
              <p className="text-xs text-surface-400 mt-1">Sessions Today</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-3xl font-display font-bold text-amber-500">{stats?.weekSessions || 0}</p>
              <p className="text-xs text-surface-400 mt-1">Sessions This Week</p>
            </div>
          </div>

          {/* Weekly Chart */}
          <ChartCard title="Weekly Focus" icon={HiBolt}>
            {stats?.weeklyData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={stats.weeklyData}>
                  <defs>
                    <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }} />
                  <Area type="monotone" dataKey="minutes" stroke="#6366f1" strokeWidth={2} fill="url(#focusGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-surface-400">Complete focus sessions to see chart</div>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default FocusPage;
