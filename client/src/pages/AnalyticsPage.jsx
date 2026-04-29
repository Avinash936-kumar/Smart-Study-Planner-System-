import { useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { HiChartBar, HiClipboardDocumentList, HiCheckCircle, HiClock, HiFire, HiBolt, HiAcademicCap } from 'react-icons/hi2';
import { useTasks } from '../hooks/useTasks';
import { useFocus } from '../hooks/useFocus';
import PageHeader from '../components/PageHeader';
import StatsWidget from '../components/StatsWidget';
import ChartCard from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalyticsPage = () => {
  const { stats: taskStats, loading: taskLoading, fetchStats: fetchTaskStats } = useTasks();
  const { stats: focusStats, loading: focusLoading, fetchStats: fetchFocusStats } = useFocus();

  useEffect(() => {
    fetchTaskStats();
    fetchFocusStats();
  }, [fetchTaskStats, fetchFocusStats]);

  const loading = taskLoading || focusLoading;

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" text="Analyzing your progress..." /></div>;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 !bg-white/90 dark:!bg-surface-900/90 !backdrop-blur-xl border border-surface-200 dark:border-surface-700 shadow-xl rounded-xl">
          <p className="text-sm font-semibold text-surface-800 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-surface-600 dark:text-surface-300">{entry.name}:</span>
              <span className="font-semibold" style={{ color: entry.color }}>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const completed = taskStats?.totalCompleted || 0;
  const total = taskStats?.totalTasks || 0;
  const productivityScore = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Format focus subject data for pie chart
  const focusSubjectData = focusStats?.subjectData?.map((item, index) => ({
    name: item._id,
    value: item.totalMinutes,
    color: COLORS[index % COLORS.length]
  })) || [];

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
      <PageHeader title="Analytics" subtitle="Deep dive into your study patterns and productivity" />

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsWidget title="Productivity Score" value={`${productivityScore}%`} subtitle="Task completion rate" icon={HiFire} color="accent" />
        <StatsWidget title="Total Focus Time" value={`${Math.round((focusStats?.weekMinutes || 0) / 60)}h`} subtitle="This week" icon={HiBolt} color="emerald" />
        <StatsWidget title="Tasks Done" value={completed} subtitle={`Out of ${total}`} icon={HiCheckCircle} color="primary" />
        <StatsWidget title="Active Days" value={taskStats?.completionTrend?.filter(d => d.completed > 0).length || 0} subtitle="Last 7 days" icon={HiClock} color="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Task Completion Trend */}
        <ChartCard title="Task Completion Trend" icon={HiChartBar}>
          <div className="h-72">
            {taskStats?.completionTrend?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={taskStats.completionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="added" name="Tasks Added" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorAdded)" />
                  <Area type="monotone" dataKey="completed" name="Tasks Completed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-surface-400">Not enough data to display trend</div>
            )}
          </div>
        </ChartCard>

        {/* Weekly Focus Time */}
        <ChartCard title="Weekly Focus Time" icon={HiBolt}>
          <div className="h-72">
            {focusStats?.weeklyData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={focusStats.weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                  <Bar dataKey="minutes" name="Focus Minutes" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-surface-400">Not enough focus data to display</div>
            )}
          </div>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tasks by Priority */}
        <ChartCard title="Tasks by Priority" icon={HiClipboardDocumentList}>
          <div className="h-72">
            {taskStats?.tasksByPriority?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskStats.tasksByPriority} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="count" nameKey="_id" label>
                    {taskStats.tasksByPriority.map((entry, index) => {
                      const color = entry._id === 'high' ? '#ef4444' : entry._id === 'medium' ? '#f59e0b' : '#10b981';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-surface-400">No priority data available</div>
            )}
          </div>
        </ChartCard>

        {/* Focus Time by Subject */}
        <ChartCard title="Focus by Subject" icon={HiAcademicCap}>
          <div className="h-72">
            {focusSubjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={focusSubjectData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" nameKey="name" label>
                    {focusSubjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-surface-400">No subject focus data available</div>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default AnalyticsPage;
