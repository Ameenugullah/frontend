import { AlertCircle, Lock } from 'lucide-react';

export default function AdminLoginScreen({ loginForm, setLoginForm, login, loginError }) {
  const handleLogin = () => login(loginForm.email, loginForm.password);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-charcoal-900">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <span className="block text-5xl leading-none font-script text-cream-50">NuraBahar</span>
          <span className="font-body text-xs tracking-[0.3em] uppercase text-blush-400 mt-1 block">Admin Portal</span>
        </div>
        <div className="p-8 border bg-white/5 border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={20} className="text-blush-400" />
            <h2 className="text-xl font-light font-display text-cream-50">Sign In</h2>
          </div>
          {loginError && (
            <div className="flex items-center gap-2 px-4 py-3 mb-5 text-sm border bg-blush-500/20 border-blush-500/40 text-blush-300 font-body">
              <AlertCircle size={16} /> {loginError}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-xs tracking-widest uppercase font-body text-white/50">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 text-sm border bg-white/10 border-white/20 text-cream-50 font-body focus:outline-none focus:border-blush-400"
                placeholder="admin@nurabahar.ng"
              />
            </div>
            <div>
              <label className="block mb-2 text-xs tracking-widest uppercase font-body text-white/50">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 text-sm border bg-white/10 border-white/20 text-cream-50 font-body focus:outline-none focus:border-blush-400"
                placeholder="••••••••••"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full py-3 font-medium text-white transition-colors duration-200 bg-blush-500 hover:bg-blush-600 font-body"
            >
              Sign In to Dashboard
            </button>
          </div>
          <p className="mt-6 text-xs text-center font-body text-white/20">Nura Bahar · Admin Access Only</p>
        </div>
      </div>
    </div>
  );
}