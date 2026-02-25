import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-6 py-20">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-lg border border-parchment">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-ink mb-2">Welcome Back</h1>
          <p className="text-mud text-sm font-hind">Login to manage your bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="form-input-light w-full"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="form-input-light w-full"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-saffron text-white text-sm font-hind tracking-widest uppercase py-3 rounded-sm hover:bg-saf-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-mud text-sm font-hind">
            Don't have an account?{' '}
            <Link to="/register" className="text-saffron hover:underline">
              Register here
            </Link>
          </p>
        </div>

        <div className="mt-4 p-3 bg-parchment rounded-sm text-xs font-hind text-mud">
          <strong>Demo Admin:</strong> admin@havelistay.in / admin123
        </div>
      </div>
    </div>
  );
}
