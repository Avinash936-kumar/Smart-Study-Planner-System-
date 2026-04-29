import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSparkles, HiEnvelope, HiLockClosed, HiUser, HiEye, HiEyeSlash } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex mesh-gradient">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 via-primary-700 to-primary-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-40 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary-300 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <HiSparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">StudyPlanner</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-6">
            Start Your<br />
            <span className="text-accent-200">Journey Today</span>
          </h1>
          <p className="text-primary-100 text-lg max-w-md leading-relaxed">
            Create your account and experience intelligent study scheduling that adapts to your needs.
          </p>

          <div className="mt-10 space-y-4">
            {['Smart task scheduling', 'Progress analytics', 'Deadline reminders', 'Secure & private'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/80">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-primary-200 text-sm">
          © 2025 Smart Study Planner — LPU Capstone
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
              <HiSparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-surface-900 dark:text-white">StudyPlanner</span>
          </div>

          <h2 className="text-3xl font-display font-bold text-surface-900 dark:text-white mb-2">
            Create Account
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-8">
            Fill in your details to get started
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="floating-label">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-field !pl-12"
                  required
                  minLength={2}
                  id="register-name"
                />
              </div>
            </div>

            <div>
              <label className="floating-label">Email</label>
              <div className="relative">
                <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field !pl-12"
                  required
                  id="register-email"
                />
              </div>
            </div>

            <div>
              <label className="floating-label">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="input-field !pl-12 !pr-12"
                  required
                  minLength={6}
                  id="register-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="floating-label">Confirm Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="input-field !pl-12"
                  required
                  minLength={6}
                  id="register-confirm-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full !py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              id="register-submit"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-surface-500 dark:text-surface-400 mt-8">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              id="register-login-link"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
