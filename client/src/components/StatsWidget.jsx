import { motion } from 'framer-motion';

const StatsWidget = ({ title, value, subtitle, icon: Icon, color = 'primary', trend = null }) => {
  const colorMap = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      icon: 'text-primary-500',
      ring: 'ring-primary-500/20',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      icon: 'text-emerald-500',
      ring: 'ring-emerald-500/20',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      icon: 'text-amber-500',
      ring: 'ring-amber-500/20',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-500',
      ring: 'ring-red-500/20',
    },
    accent: {
      bg: 'bg-accent-50 dark:bg-accent-900/20',
      icon: 'text-accent-500',
      ring: 'ring-accent-500/20',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-500',
      ring: 'ring-blue-500/20',
    },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
      className="glass-card p-5 cursor-default"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-display font-bold text-surface-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
              {subtitle}
            </p>
          )}
          {trend !== null && (
            <p
              className={`text-xs font-semibold mt-1.5 ${
                trend >= 0 ? 'text-emerald-500' : 'text-red-500'
              }`}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% this week
            </p>
          )}
        </div>
        <div
          className={`p-3 rounded-xl ${colors.bg} ring-1 ${colors.ring}`}
        >
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsWidget;
