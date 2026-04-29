import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSparkles, HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex mesh-gradient">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <HiSparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">StudyPlanner</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-6">
            Welcome Back,<br />
            <span className="text-primary-200">Scholar!</span>
          </h1>
          <p className="text-primary-100 text-lg max-w-md leading-relaxed">
            Continue your journey towards academic excellence. Your smart study schedule awaits.
          </p>
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
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
              <HiSparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-surface-900 dark:text-white">StudyPlanner</span>
          </div>

          <h2 className="text-3xl font-display font-bold text-surface-900 dark:text-white mb-2">
            Sign In
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-8">
            Enter your credentials to access your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  id="login-email"
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
                  placeholder="••••••••"
                  className="input-field !pl-12 !pr-12"
                  required
                  minLength={6}
                  id="login-password"
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

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full !py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              id="login-submit"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-surface-500 dark:text-surface-400 mt-8">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              id="login-register-link"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
