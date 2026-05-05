import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

export default function Login() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const { login, register, loading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  // Countdown timer
  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        setCountdown(0);
        setError('');
        clearInterval(interval);
      } else {
        setCountdown(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const isLocked = lockoutUntil && Date.now() < lockoutUntil;

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLocked) return;
    if (!form.email.trim() || !form.password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    const result = await login(form.email, form.password);
    if (result.success) {
      navigate('/');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_SECONDS * 1000;
        setLockoutUntil(until);
        setError(`Too many failed attempts. Please reset your password or try again in ${LOCKOUT_SECONDS} seconds.`);
      } else {
        setError(`${result.error} (${MAX_ATTEMPTS - newAttempts} attempts remaining)`);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    const result = await register(form.email, form.password, form.name);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-script text-5xl text-charcoal-900 leading-none">NuraBahar</span>
            <span className="font-body text-[9px] tracking-[0.3em] uppercase text-charcoal-700/50 block mt-1">Nigeria</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-sand-200 shadow-card p-8">

          {/* Tabs */}
          <div className="flex border-b border-sand-200 mb-8">
            {[{ key: 'login', label: 'Sign In' }, { key: 'register', label: 'Create Account' }].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setError(''); setSuccess(''); }}
                className={`flex-1 font-body text-sm pb-3 transition-all duration-200 ${
                  tab === t.key
                    ? 'text-charcoal-800 border-b-2 border-charcoal-800 font-medium'
                    : 'text-charcoal-700/50 hover:text-charcoal-700'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-blush-50 border border-blush-200 text-blush-600 text-sm px-4 py-3 mb-5 font-body animate-fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 mb-5 font-body animate-fade-in">
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Lockout banner */}
          {isLocked && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-sm px-4 py-3 mb-5 font-body">
              <Lock size={16} className="shrink-0" />
              <span>Account locked. Try again in <strong>{countdown}s</strong> or{' '}
                <Link to="/forgot-password" className="underline font-medium">reset your password</Link>.
              </span>
            </div>
          )}

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">Email</label>
                <input type="email" value={form.email} onChange={set('email')}
                  className="input-field" placeholder="fatima@email.com"
                  disabled={isLocked} autoComplete="email" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60">Password</label>
                  <Link to="/forgot-password" className="font-body text-xs text-blush-500 hover:text-blush-600 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')}
                    className="input-field pr-10" placeholder="••••••••"
                    disabled={isLocked} autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-700/40 hover:text-charcoal-700">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading || isLocked}
                className={`w-full py-3.5 font-body font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading || isLocked
                    ? 'bg-charcoal-700/40 text-white cursor-not-allowed'
                    : 'bg-charcoal-900 text-white hover:bg-charcoal-800'
                }`}>
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : isLocked ? (
                  `Locked — ${countdown}s`
                ) : 'Sign In'}
              </button>

              {/* Attempt indicator */}
              {failedAttempts > 0 && !isLocked && (
                <div className="flex gap-1 justify-center">
                  {[...Array(MAX_ATTEMPTS)].map((_, i) => (
                    <div key={i}
                      className={`w-2 h-2 rounded-full ${i < failedAttempts ? 'bg-blush-500' : 'bg-sand-200'}`} />
                  ))}
                </div>
              )}
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">Full Name</label>
                <input type="text" value={form.name} onChange={set('name')}
                  className="input-field" placeholder="Fatima Abdullahi" autoComplete="name" />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">Email</label>
                <input type="email" value={form.email} onChange={set('email')}
                  className="input-field" placeholder="fatima@email.com" autoComplete="email" />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')}
                    className="input-field pr-10" placeholder="Min. 8 characters" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-700/40 hover:text-charcoal-700">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="flex gap-1 mt-2">
                    {[8, 12, 16].map((len, i) => (
                      <div key={len}
                        className={`flex-1 h-1 transition-colors ${form.password.length >= len ? ['bg-blush-500','bg-amber-400','bg-green-500'][i] : 'bg-sand-200'}`} />
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" disabled={loading}
                className={`w-full py-3.5 font-body font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading ? 'bg-charcoal-700/40 text-white cursor-not-allowed' : 'bg-charcoal-900 text-white hover:bg-charcoal-800'
                }`}>
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                ) : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        <p className="font-body text-xs text-charcoal-700/40 text-center mt-5">
          By continuing you agree to our{' '}
          <Link to="/faq" className="underline hover:text-charcoal-700">Terms & Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
