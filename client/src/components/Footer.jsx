import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-white/60">
      <div className="max-w-5xl mx-auto px-6 md:px-14 py-14 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-saffron text-2xl">🏛</span>
            <div>
              <div className="font-serif text-xl text-white leading-none">Haveli Stay</div>
              <div className="text-[0.55rem] tracking-[0.2em] text-turmeric uppercase font-hind">Uttar Pradesh</div>
            </div>
          </div>
          <p className="text-white/50 text-xs leading-relaxed font-hind">
            Experience authentic UP heritage, culture and warm Indian hospitality in our century-old haveli.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <div className="text-white text-xs tracking-widest uppercase font-hind mb-4">Quick Links</div>
          <ul className="space-y-2 list-none">
            {['/', '/about', '/rooms', '/gallery', '/booking'].map((path, i) => (
              <li key={path}>
                <Link to={path} className="text-white/50 text-xs font-hind no-underline hover:text-saffron transition-colors">
                  {['Home', 'About Us', 'Rooms', 'Gallery', 'Book Now'][i]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Destinations */}
        <div>
          <div className="text-white text-xs tracking-widest uppercase font-hind mb-4">We Cover</div>
          <ul className="space-y-2 list-none">
            {['🕌 Lucknow', '🕍 Agra', '🛕 Varanasi', '🌊 Prayagraj', '🏯 Ayodhya'].map(d => (
              <li key={d}><span className="text-white/50 text-xs font-hind">{d}</span></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="text-white text-xs tracking-widest uppercase font-hind mb-4">Contact</div>
          <ul className="space-y-3 list-none">
            <li className="text-white/50 text-xs font-hind">📍 Hazratganj, Lucknow, UP 226001</li>
            <li><a href="tel:+919876543210" className="text-white/50 text-xs font-hind no-underline hover:text-saffron">📞 +91 98765 43210</a></li>
            <li><a href="mailto:info@havelistay.in" className="text-white/50 text-xs font-hind no-underline hover:text-saffron">✉ info@havelistay.in</a></li>
            <li className="text-white/50 text-xs font-hind">🕐 Open Daily · 7AM – 10PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 md:px-14 py-4 flex flex-wrap justify-between items-center gap-3">
        <p className="text-xs font-hind">© 2024 Haveli Stay · Uttar Pradesh · All Rights Reserved</p>
        <p className="text-xs font-hind text-white/30">Built with React + Vite + Tailwind CSS</p>
      </div>
    </footer>
  )
}