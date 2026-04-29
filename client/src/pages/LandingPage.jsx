import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiSparkles,
  HiAcademicCap,
  HiChartBar,
  HiClock,
  HiBell,
  HiShieldCheck,
  HiArrowRight,
  HiCheckCircle,
} from 'react-icons/hi2';
import ThemeToggle from '../components/ThemeToggle';

const features = [
  {
    icon: HiClock,
    title: 'Smart Scheduling',
    desc: 'AI-powered algorithm that auto-prioritizes your tasks based on deadlines and importance.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: HiChartBar,
    title: 'Progress Analytics',
    desc: 'Visual dashboards with charts to track your study performance and completion rates.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: HiBell,
    title: 'Smart Reminders',
    desc: 'Never miss a deadline with intelligent notification alerts for upcoming tasks.',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: HiShieldCheck,
    title: 'Secure & Private',
    desc: 'Your data is protected with JWT authentication and encrypted passwords.',
    color: 'from-emerald-500 to-emerald-600',
  },
];

const teamMembers = [
  { name: 'Avinash Kumar', role: 'Full Stack Developer' },
  { name: 'Hirak Roy', role: 'Backend Developer' },
  { name: 'Alvath Ruthik', role: 'Frontend Developer' },
  { name: 'Kirthik Rishardhan S R', role: 'UI/UX Designer' },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-100 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                <HiSparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-surface-900 dark:text-white">
                StudyPlanner
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/login" className="btn-ghost text-sm" id="nav-login">
                Sign In
              </Link>
              <Link to="/register" className="btn-gradient text-sm !px-5 !py-2" id="nav-register">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 mesh-gradient">
        {/* Animated bg orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/15 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6">
              <HiAcademicCap className="w-4 h-4" />
              LPU Capstone Project 2025
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold text-surface-900 dark:text-white leading-tight mb-6"
          >
            Study Smarter,{' '}
            <span className="gradient-text">Not Harder</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            An intelligent study planning system that automatically schedules your tasks,
            tracks your progress, and helps you manage your time effectively.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="btn-gradient text-base flex items-center gap-2 !px-8 !py-4"
              id="hero-cta"
            >
              Start Planning Free
              <HiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="btn-outline text-base !px-8 !py-4"
              id="hero-login"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-8 sm:gap-14 mt-16"
          >
            {[
              { value: 'Smart', label: 'Scheduling' },
              { value: '100%', label: 'Responsive' },
              { value: '24/7', label: 'Accessible' },
              { value: 'Secure', label: 'JWT Auth' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-surface-400 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" id="features">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white mt-2">
              Everything You Need to{' '}
              <span className="gradient-text">Excel</span>
            </h2>
            <p className="text-surface-500 dark:text-surface-400 max-w-xl mx-auto mt-4">
              Powerful tools designed specifically for students to maximize productivity and achieve academic success.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-6 text-center group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-bold text-surface-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-100/50 dark:bg-surface-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white mt-2">
              Three Simple Steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Add Your Tasks', desc: 'Enter your assignments, deadlines, and priorities in seconds.' },
              { step: '02', title: 'Get Smart Schedule', desc: 'Our algorithm creates an optimized study plan automatically.' },
              { step: '03', title: 'Track & Achieve', desc: 'Monitor your progress and stay on top of every deadline.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-6xl font-display font-black gradient-text mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-display font-bold text-surface-800 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-surface-500 dark:text-surface-400">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" id="team">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">
              Our Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white mt-2">
              Meet the Developers
            </h2>
            <p className="text-surface-400 mt-2">
              Lovely Professional University, Punjab, India
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-6 text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-display font-bold text-surface-800 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-surface-400 mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl p-12 sm:p-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Ready to Boost Your Grades?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
              Join the smart way to manage your study schedule. Start organizing your academic life today.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              id="cta-register"
            >
              Get Started Now
              <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 dark:border-surface-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiSparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-surface-700 dark:text-surface-300">
              StudyPlanner
            </span>
          </div>
          <p className="text-sm text-surface-400">
            © 2025 Smart Study Planner | LPU Capstone Project
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
