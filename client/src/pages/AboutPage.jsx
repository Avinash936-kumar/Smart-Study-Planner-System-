import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiSparkles,
  HiCpuChip,
  HiCircleStack,
  HiShieldCheck,
  HiDevicePhoneMobile,
  HiArrowRight,
  HiAcademicCap,
  HiRocketLaunch,
  HiLightBulb,
  HiCog6Tooth,
} from 'react-icons/hi2';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const AboutPage = () => {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-scroll overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
            <HiAcademicCap className="w-4 h-4" />
            LPU Capstone Project
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white mb-3">
            Smart Study Planner System
          </h1>
          <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
            An Effective Student Time Management Solution
          </p>
        </motion.div>

        {/* About Project */}
        <motion.section {...fadeUp} className="glass-card p-8 mb-8">
          <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <HiLightBulb className="w-6 h-6 text-amber-500" />
            About the Project
          </h2>
          <p className="text-surface-600 dark:text-surface-400 leading-relaxed mb-4">
            The Smart Study Planner System is a comprehensive web-based application designed to help
            students manage their academic tasks and study schedules effectively. In today's fast-paced
            educational environment, students often struggle with time management, leading to missed
            deadlines and decreased academic performance.
          </p>
          <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
            This system addresses these challenges by providing an intelligent scheduling algorithm
            that automatically prioritizes tasks based on deadlines and importance, balanced study
            schedules that prevent overload, real-time progress tracking with visual analytics,
            and a modern, intuitive interface inspired by leading productivity tools.
          </p>
        </motion.section>

        {/* Methodology */}
        <motion.section {...fadeUp} className="glass-card p-8 mb-8">
          <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <HiCog6Tooth className="w-6 h-6 text-primary-500" />
            Methodology
          </h2>
          <p className="text-surface-600 dark:text-surface-400 leading-relaxed mb-4">
            We followed the <strong>Agile Development Methodology</strong> with iterative sprints
            to ensure continuous improvement and user-centered design.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { step: 'Requirements Gathering', desc: 'Analyzed student needs and pain points through surveys and interviews.' },
              { step: 'System Design', desc: 'Designed database schemas, API architecture, and UI wireframes.' },
              { step: 'Development', desc: 'Built frontend (React) and backend (Node.js) with iterative testing.' },
              { step: 'Testing & Deployment', desc: 'Performed unit testing, integration testing, and deployment.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 text-primary-600 dark:text-primary-400 font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-surface-800 dark:text-surface-200 text-sm">
                    {item.step}
                  </h4>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* System Architecture */}
        <motion.section {...fadeUp} className="glass-card p-8 mb-8">
          <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
            <HiCpuChip className="w-6 h-6 text-accent-500" />
            System Architecture
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: HiDevicePhoneMobile,
                title: 'Frontend',
                tech: 'React.js + Tailwind CSS',
                desc: 'Responsive SPA with modern UI, dark mode, and animations.',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: HiCpuChip,
                title: 'Backend',
                tech: 'Node.js + Express.js',
                desc: 'RESTful API with JWT authentication and validation.',
                color: 'from-emerald-500 to-emerald-600',
              },
              {
                icon: HiCircleStack,
                title: 'Database',
                tech: 'MongoDB + Mongoose',
                desc: 'NoSQL database with indexed schemas for fast queries.',
                color: 'from-accent-500 to-accent-600',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}
                >
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-bold text-surface-800 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-primary-500 font-semibold mt-0.5 mb-2">
                  {item.tech}
                </p>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Results & Benefits */}
        <motion.section {...fadeUp} className="glass-card p-8 mb-8">
          <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <HiRocketLaunch className="w-6 h-6 text-emerald-500" />
            Results & Benefits
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Improved time management for students',
              'Reduced missed deadlines by smart scheduling',
              'Visual progress tracking increases motivation',
              'Balanced workload prevents burnout',
              'Secure multi-user authentication system',
              'Responsive design works on all devices',
              'Intuitive UI reduces learning curve',
              'Smart algorithm adapts to task urgency',
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 text-xs">✓</span>
                </div>
                <span className="text-sm text-surface-600 dark:text-surface-400">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Future Scope */}
        <motion.section {...fadeUp} className="glass-card p-8 mb-8">
          <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <HiSparkles className="w-6 h-6 text-primary-500" />
            Future Scope
          </h2>
          <div className="space-y-3">
            {[
              'AI/ML-based study recommendations and personalized learning paths',
              'Mobile application (React Native) for iOS and Android',
              'Integration with Google Calendar and university LMS systems',
              'Collaborative study groups and peer accountability features',
              'Pomodoro timer and focus mode for study sessions',
              'Export reports as PDF for academic review',
              'Push notifications and email reminders',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <HiArrowRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-surface-600 dark:text-surface-400">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Team */}
        <motion.section {...fadeUp} className="glass-card p-8 mb-8">
          <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-2">
            Team Members
          </h2>
          <p className="text-sm text-surface-400 mb-6">
            Lovely Professional University, Punjab, India
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'Avinash Kumar', role: 'Full Stack Developer' },
              { name: 'Hirak Roy', role: 'Backend Developer' },
              { name: 'Alvath Ruthik', role: 'Frontend Developer' },
              { name: 'Kirthik Rishardhan S R', role: 'UI/UX Designer' },
            ].map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold shadow">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-surface-800 dark:text-surface-200">
                    {member.name}
                  </h4>
                  <p className="text-xs text-surface-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
