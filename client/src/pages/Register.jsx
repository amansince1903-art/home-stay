import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-6 py-20">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-lg border border-parchment">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-ink mb-2">Create Account</h1>
          <p className="text-mud text-sm font-hind">Join Haveli Stay family</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-input-light w-full"
              placeholder="Your name"
            />
          </div>

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
            <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="form-input-light w-full"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
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
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-mud text-sm font-hind">
            Already have an account?{' '}
            <Link to="/login" className="text-saffron hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
