const ChartCard = ({ title, icon: Icon, children, className = '' }) => (
  <div className={`glass-card p-6 ${className}`}>
    <h3 className="font-display font-bold text-surface-800 dark:text-white mb-4 flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-primary-500" />}
      {title}
    </h3>
    {children}
  </div>
);

export default ChartCard;
