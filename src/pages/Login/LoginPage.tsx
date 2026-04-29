import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginWithEmail } from '../../services/firebase';
import { useAuthStore } from '../../store/authStore';

const DEMO = { email: 'demo@healthos.com', password: 'Demo@1234' };

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setError, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      setUser(await loginWithEmail(email, password));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? mapError(err.message) : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }, [email, password, navigate, setUser, setError]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="mb-10">
          <span className="text-zinc-900 font-semibold tracking-tight">HealthOS</span>
          <span className="ml-2 text-zinc-400 text-xs">Enterprise</span>
        </div>

        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-1.5">
          Sign in
        </h1>
        <p className="text-[13px] text-zinc-500 mb-8">
          Enter your credentials to continue.
        </p>

        {error && (
          <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-5">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-zinc-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@clinic.com"
              required
              className="block w-full px-3 py-2 text-[13px] text-zinc-900 bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-600 focus:ring-0 transition placeholder:text-zinc-400"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-zinc-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="block w-full px-3 py-2 pr-9 text-[13px] text-zinc-900 bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-600 transition placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => setShow(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {show ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white text-[13px] font-medium py-2 rounded transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {loading ? 'Signing in…' : 'Continue →'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-200">
          <p className="text-[11px] text-zinc-400 font-mono">
            {DEMO.email} · {DEMO.password}
          </p>
          <button
            onClick={() => { setEmail(DEMO.email); setPassword(DEMO.password); }}
            className="mt-1 text-[12px] text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Use demo account →
          </button>
        </div>
      </div>
    </div>
  );
}

function mapError(msg: string): string {
  if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential'))
    return 'Invalid email or password.';
  if (msg.includes('too-many-requests')) return 'Too many attempts. Try again later.';
  if (msg.includes('network-request-failed')) return 'Network error.';
  return 'Sign-in failed.';
}
