import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setErrorMsg('Please enter your email address.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErrorMsg('Please enter a valid email address.'); return; }
    setStatus('loading');
    setErrorMsg('');
    const result = await forgotPassword(email);
    setStatus(result.success ? 'success' : 'error');
    if (!result.success) setErrorMsg(result.error);
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

        <div className="bg-white border border-sand-200 shadow-card p-8">

          {/* Back */}
          <Link to="/login"
            className="flex items-center gap-2 font-body text-sm text-charcoal-700/50 hover:text-charcoal-800 transition-colors mb-6">
            <ArrowLeft size={15} /> Back to Sign In
          </Link>

          {/* Icon */}
          <div className="w-14 h-14 bg-blush-50 border border-blush-100 flex items-center justify-center mb-5">
            <Mail size={24} className="text-blush-500" />
          </div>

          <h1 className="font-display text-2xl text-charcoal-800 font-light italic mb-2">Reset Password</h1>
          <p className="font-body text-sm text-charcoal-700/60 mb-7 leading-relaxed">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* Success state */}
          {status === 'success' ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <h2 className="font-display text-xl text-charcoal-800 font-light mb-3">Check your inbox</h2>
              <p className="font-body text-sm text-charcoal-700/60 mb-6 leading-relaxed">
                We've sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
              </p>
              <p className="font-body text-xs text-charcoal-700/40 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button onClick={() => setStatus('idle')}
                className="btn-outline text-sm py-2.5 px-5">
                Try Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="flex items-start gap-2 bg-blush-50 border border-blush-200 text-blush-600 text-sm px-4 py-3 font-body animate-fade-in">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-2 block">
                  Email Address
                </label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrorMsg(''); }}
                  className="input-field" placeholder="fatima@email.com" autoComplete="email"
                  disabled={status === 'loading'} />
              </div>

              <button type="submit" disabled={status === 'loading'}
                className={`w-full py-3.5 font-body font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  status === 'loading'
                    ? 'bg-charcoal-700/40 text-white cursor-not-allowed'
                    : 'bg-blush-500 text-white hover:bg-blush-600'
                }`}>
                {status === 'loading' ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                ) : (
                  <><Mail size={15} /> Send Reset Link</>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="font-body text-xs text-charcoal-700/40 text-center mt-5">
          Remember your password?{' '}
          <Link to="/login" className="text-blush-500 hover:text-blush-600 transition-colors">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
