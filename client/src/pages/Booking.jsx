import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const roomOptions = [
  'Royal Haveli Suite — ₹2,500/night',
  'Gangamahal Room — ₹1,800/night',
  'Family Kothi — ₹4,200/night',
  'Help me choose',
]

export default function Booking() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', guests: '', checkin: '', checkout: '', room: '', source: '', message: '' })
  const [status, setStatus]   = useState('idle') // idle | loading | success | error
  const [errMsg, setErrMsg]   = useState('')

  const today = new Date().toISOString().split('T')[0]

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res  = await fetch('/api/inquiries', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const json = await res.json()
      if (json.success) {
        setStatus('success')
      } else {
        throw new Error(json.message)
      }
    } catch (err) {
      setErrMsg(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <>
      <PageHeader
        label="Reserve Your Stay"
        title='Book Your <em class="italic" style="color:#F2A830;">Heritage Stay</em>'
        subtitle="No advance payment. We confirm within 24 hours."
      />

      <section className="py-16 px-6 md:px-14 bg-ivory">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">

          {/* ── FORM ── */}
          <div className="md:col-span-2">
            <h2 className="font-serif text-2xl font-normal mb-6">Inquiry Details</h2>

            {status === 'success' ? (
              <div className="bg-green-50 border border-green-300 text-green-800 px-6 py-8 rounded-sm text-center">
                <div className="text-4xl mb-3">🙏</div>
                <h3 className="font-serif text-xl mb-2">Dhanyavaad!</h3>
                <p className="font-hind text-sm">Your inquiry has been received. We'll contact you within 24 hours.</p>
                <Link to="/" className="inline-block mt-4 text-saffron text-sm font-hind underline">← Back to Home</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name *',        name: 'name',     type: 'text',  placeholder: 'Aapka naam',         required: true },
                  { label: 'Email *',            name: 'email',    type: 'email', placeholder: 'email@example.com',  required: true },
                  { label: 'Phone / WhatsApp *', name: 'phone',    type: 'tel',   placeholder: '+91 98765 43210',    required: true },
                ].map(f => (
                  <div key={f.name} className="flex flex-col gap-1">
                    <label className="text-mud text-[0.6rem] tracking-widest uppercase font-hind">{f.label}</label>
                    <input type={f.type} name={f.name} placeholder={f.placeholder} required={f.required} value={form[f.name]} onChange={handleChange} className="form-input-light" />
                  </div>
                ))}

                <div className="flex flex-col gap-1">
                  <label className="text-mud text-[0.6rem] tracking-widest uppercase font-hind">No. of Guests *</label>
                  <select name="guests" required value={form.guests} onChange={handleChange} className="form-input-light">
                    <option value="" disabled>Select</option>
                    {['1 Guest', '2 Guests', '3 Guests', '4+ Guests'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-mud text-[0.6rem] tracking-widest uppercase font-hind">Check-in Date *</label>
                  <input type="date" name="checkin" required min={today} value={form.checkin} onChange={handleChange} className="form-input-light" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-mud text-[0.6rem] tracking-widest uppercase font-hind">Check-out Date *</label>
                  <input type="date" name="checkout" required min={form.checkin || today} value={form.checkout} onChange={handleChange} className="form-input-light" />
                </div>

                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-mud text-[0.6rem] tracking-widest uppercase font-hind">Room Preference</label>
                  <select name="room" value={form.room} onChange={handleChange} className="form-input-light">
                    <option value="">Select a room</option>
                    {roomOptions.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-mud text-[0.6rem] tracking-widest uppercase font-hind">Special Requests</label>
                  <textarea name="message" rows={4} placeholder="Dietary needs, local tours, special occasions..." value={form.message} onChange={handleChange} className="form-input-light resize-y" />
                </div>

                {status === 'error' && (
                  <div className="md:col-span-2 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-sm text-sm font-hind">{errMsg}</div>
                )}

                <div className="md:col-span-2">
                  <button type="submit" disabled={status === 'loading'} className="w-full bg-saffron text-white text-sm font-hind tracking-widest uppercase py-3.5 rounded-sm hover:bg-saf-dark transition-colors border-none cursor-pointer disabled:opacity-60">
                    {status === 'loading' ? 'Sending...' : 'Send Booking Inquiry →'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-5">
            <div className="bg-parchment p-5 rounded-sm border border-warm">
              <h3 className="font-serif text-lg font-semibold mb-3">Room Rates</h3>
              <div className="space-y-3 text-sm font-hind">
                {[['Royal Suite', '₹2,500'], ['Gangamahal', '₹1,800'], ['Family Kothi', '₹4,200']].map(([n, p]) => (
                  <div key={n} className="flex justify-between border-b border-parchment pb-2 last:border-0">
                    <span className="text-mud">{n}</span>
                    <span className="font-semibold text-saffron">{p}/night</span>
                  </div>
                ))}
              </div>
              <p className="text-mud-light text-xs mt-3 font-hind">All rates include breakfast. GST extra.</p>
            </div>

            <div className="bg-parchment p-5 rounded-sm border border-warm">
              <h3 className="font-serif text-lg font-semibold mb-3">What's Included</h3>
              <ul className="space-y-1.5 list-none">
                {['Daily breakfast (Awadhi style)', 'Airport / Station pickup', 'Heritage walking tour', 'Free WiFi', '24/7 host support'].map(f => (
                  <li key={f} className="feat-item">{f}</li>
                ))}
              </ul>
            </div>

            <div className="bg-maroon p-5 rounded-sm text-white">
              <h3 className="font-serif text-lg mb-2">Need Help?</h3>
              <p className="text-white/70 text-xs font-hind mb-3">Call or WhatsApp us directly for instant confirmation.</p>
              <a href="tel:+919876543210" className="block text-center bg-saffron text-white text-xs font-hind tracking-widest uppercase py-2.5 rounded-sm hover:bg-saf-dark transition-colors no-underline">📞 Call Now</a>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}