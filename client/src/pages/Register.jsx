import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { validatePhone, cleanPhone } from '../utils/validation';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setForm({ ...form, phone: value });
      if (phoneError) setPhoneError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone if provided
    if (form.phone) {
      const phoneValidation = validatePhone(form.phone);
      if (!phoneValidation.valid) {
        setPhoneError(phoneValidation.message);
        toast.error(phoneValidation.message);
        return;
      }
    }
    
    setLoading(true);
    try {
      // Clean phone number before sending
      const submitData = {
        ...form,
        phone: form.phone ? cleanPhone(form.phone) : ''
      };
      await register(submitData);
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
          <p className="text-mud text-sm font-hind">Join DAISY DALE family</p>
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
              onChange={handlePhoneChange}
              maxLength="10"
              pattern="[0-9]*"
              inputMode="numeric"
              className={`form-input-light w-full ${phoneError ? 'border-red-500' : ''}`}
              placeholder="9876543210"
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1 font-hind">{phoneError}</p>
            )}
            <p className="text-mud/60 text-xs mt-1 font-hind">Enter 10-digit mobile number (digits only)</p>
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
