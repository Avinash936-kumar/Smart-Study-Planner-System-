import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <p className="text-surface-500 dark:text-surface-400 mt-1">{subtitle}</p>
      )}
    </div>
    {children && <div className="flex items-center gap-3">{children}</div>}
  </div>
);

export default PageHeader;
