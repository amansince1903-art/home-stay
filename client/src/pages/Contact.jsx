import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import PageHeader from '../components/PageHeader'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = e => {
    const { name, value } = e.target;
    
    // Restrict phone to 10 digits only
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setForm(f => ({ ...f, [name]: digitsOnly }));
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      const { data } = await axios.post('/api/contacts', form)
      if (data.success) {
        setStatus('success')
        toast.success('Message sent successfully!')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <>
      <PageHeader label="Reach Us" title='Get in <em class="italic" style="color:#F2A830;">Touch</em>' subtitle="We'd love to hear from you. Reach out anytime." />

      <section className="py-16 px-6 md:px-14 bg-ivory">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">

          {/* Info */}
          <div>
            <h2 className="font-serif text-2xl font-normal mb-7">Contact Information</h2>
            <div className="space-y-5">
              {[
                { icon: '📍', label: 'Address',           value: 'DAISY DALE, Dehradun Foothills, Uttarakhand, India' },
                { icon: '📞', label: 'Phone / WhatsApp',  value: '+91 70603 79939',   href: 'tel:+917060379939' },
                { icon: '📞', label: 'Phone / WhatsApp',  value: '+91 88599 51500',   href: 'tel:+918859951500' },
                { icon: '✉️', label: 'Email',             value: 'info@daisydale.in', href: 'mailto:info@daisydale.in' },
                { icon: '🕐', label: 'Reception Hours',   value: '24/7 Support Available' },
              ].map(item => (
                <div key={item.label} className="flex gap-4 items-start">
                  <div className="w-11 h-11 bg-saffron rounded-full grid place-items-center text-white text-lg shrink-0">{item.icon}</div>
                  <div>
                    <strong className="block text-xs tracking-widest uppercase font-hind mb-0.5">{item.label}</strong>
                    {item.href
                      ? <a href={item.href} className="text-mud text-sm font-hind no-underline hover:text-saffron">{item.value}</a>
                      : <span className="text-mud text-sm font-hind">{item.value}</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-8 bg-parchment rounded-sm overflow-hidden border border-warm h-52 flex items-center justify-center">
              <div className="text-center text-mud font-hind">
                <div className="text-3xl mb-2">🗺</div>
                <div className="text-sm">Dehradun, Uttarakhand</div>
                <a href="https://maps.google.com/?q=Dehradun+Uttarakhand" target="_blank" rel="noreferrer" className="text-saffron text-xs no-underline hover:underline mt-1 block">Open in Google Maps →</a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-serif text-2xl font-normal mb-7">Send a Message</h2>

            {status === 'success' ? (
              <div className="bg-green-50 border border-green-300 text-green-800 px-6 py-8 rounded-sm text-center font-hind">
                <div className="text-4xl mb-3">🙏</div>
                <p className="text-sm">Dhanyavaad! Your message has been sent. We'll reply soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {[
                  { label: 'Full Name *',  name: 'name',  type: 'text',  placeholder: 'Aapka naam',       required: true },
                  { label: 'Email *',      name: 'email', type: 'email', placeholder: 'email@example.com', required: true },
                  { label: 'Phone',        name: 'phone', type: 'tel',   placeholder: '9876543210',   required: false, maxLength: 10, pattern: '[0-9]*', inputMode: 'numeric' },
                ].map(f => (
                  <div key={f.name} className="flex flex-col gap-1">
                    <label className="text-mud text-[0.6rem] tracking-widest uppercase font-hind">{f.label}</label>
                    <input 
                      type={f.type} 
                      name={f.name} 
                      placeholder={f.placeholder} 
                      required={f.required} 
                      maxLength={f.maxLength}
                      pattern={f.pattern}
                      inputMode={f.inputMode}
                      value={form[f.name]} 
                      onChange={handleChange} 
                      className="form-input-light" 
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1">
                  <label className="text-mud text-[0.6rem] tracking-widest uppercase font-hind">Subject</label>
                  <select name="subject" value={form.subject} onChange={handleChange} className="form-input-light">
                    <option value="">Select subject</option>
                    {['Room Inquiry', 'Booking Help', 'Local Tours', 'General Query'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-mud text-[0.6rem] tracking-widest uppercase font-hind">Message *</label>
                  <textarea name="message" rows={5} placeholder="Apna sandesh likhein..." required value={form.message} onChange={handleChange} className="form-input-light resize-y" />
                </div>
                <button type="submit" disabled={status === 'loading'} className="bg-saffron text-white text-sm font-hind tracking-widest uppercase py-3.5 rounded-sm hover:bg-saf-dark transition-colors border-none cursor-pointer self-start px-8 disabled:opacity-60">
                  {status === 'loading' ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}