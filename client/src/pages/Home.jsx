import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../components/useReveal'
import DateRangePicker from '../components/DateRangePicker'

/* ── Data ── */
const destinations = [
  { name: 'Agra',       sub: 'Taj Mahal · Mughal Heritage',  img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500&q=80' },
  { name: 'Varanasi',   sub: 'Ghats · Spiritual Capital',    img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500&q=80' },
  { name: 'Lucknow',    sub: 'Nawabi · Awadhi Cuisine',      img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&q=80' },
  { name: 'Prayagraj',  sub: 'Sangam · Kumbh Mela',         img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80' },
]

const rooms = [
  { id: 1, name: 'Royal Haveli Suite',  price: '₹2,500', badge: 'Most Popular', badgeColor: 'bg-saffron',   status: 'Available', statusColor: 'bg-forest', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', desc: 'Grand suite with Mughal arches, hand-painted walls & private courtyard view.', amenities: ['King Bed', 'AC', 'Courtyard View', 'Breakfast'] },
  { id: 2, name: 'Gangamahal Room',     price: '₹1,800', badge: null,           badgeColor: '',             status: 'Available', statusColor: 'bg-forest', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', desc: 'Wooden balcony with sacred Ganga views, antique furniture & serene ambience.', amenities: ['Double Bed', 'AC', 'Ganga View', 'Breakfast'] },
  { id: 3, name: 'Family Kothi',        price: '₹4,200', badge: null,           badgeColor: '',             status: '1 Left',    statusColor: 'bg-maroon', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80', desc: '3-bedroom kothi with private kitchen, sit-out garden & authentic home cooking.', amenities: ['3 Bedrooms', 'Kitchen', 'Garden', 'All Meals'] },
]

const reviews = [
  { name: 'Ananya Sharma',       loc: 'Delhi · 5 nights',       avatar: 'https://i.pravatar.cc/60?img=22', text: 'Staying at Haveli Stay was the highlight of our India trip. The architecture, the food, the family — everything felt like stepping back into royal UP!' },
  { name: 'Rajesh & Priya Mehta', loc: 'Mumbai · 7 nights',     avatar: 'https://i.pravatar.cc/60?img=55', text: 'The Awadhi biryani alone is worth the trip! The hosts arranged a private boat ride at Varanasi ghats at dawn — utterly magical.' },
  { name: 'Marco Bianchi',        loc: 'Milan, Italy · 4 nights', avatar: 'https://i.pravatar.cc/60?img=38', text: 'As a foreign traveller, I was nervous — but the family made me feel completely at home. The guided heritage walks were extraordinary!' },
]

const features = ['Authentic Awadhi Cuisine', 'Heritage Architecture', 'Local Sightseeing Tours', 'Airport / Station Pickup', 'Cultural Performances', 'Free WiFi']

/* ── Counter component ── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useReveal()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      let c = 0
      const step = Math.ceil(target / 60)
      const t = setInterval(() => {
        c = Math.min(c + step, target)
        setCount(c)
        if (c >= target) clearInterval(t)
      }, 25)
      obs.unobserve(el)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, ref])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Home() {
  const destRef    = useReveal()
  const aboutImgR  = useReveal()
  const aboutTxtR  = useReveal()
  const roomsRef   = useReveal()
  const galleryRef = useReveal()
  const reviewsRef = useReveal()
  const statsRef   = useReveal()

  const [quickBooking, setQuickBooking] = useState({ checkin: '', checkout: '' })
  
  const handleDateChange = (dates) => {
    setQuickBooking({ checkin: dates.checkIn, checkout: dates.checkOut });
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden" style={{ backgroundColor: '#120a06' }}>
        <div className="hero-bg absolute inset-0" />

        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <div style={{ width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,114,28,0.15) 0%, transparent 70%)' }} />
        </div>

        <div className="relative flex flex-col items-center" style={{ zIndex: 2 }}>
          <div className="animate-fade-1 text-turmeric text-xl tracking-[0.8rem] mb-5" style={{ opacity: 0.9 }}>❖ ❖ ❖</div>

          <span className="animate-fade-1 inline-block  text-saffron text-[1rem] tracking-[0.25em] uppercase px-5 py-1.5 mb-6 font-hind" style={{ background: 'black' }}>
            Uttar Pradesh · Heritage Homestay
          </span>

          <h1 className="animate-fade-2 font-serif font-normal text-white leading-[1.1] text-5xl md:text-7xl" style={{ textShadow: '0 2px 40px rgba(0,0,0,0.8)' }}>
            Experience the Soul of<br />
            <em className="italic" style={{ color: '#F2A830' }}>Uttar Pradesh</em>
          </h1>

          <p className="animate-fade-3 text-base md:text-lg max-w-xl mt-5 leading-relaxed font-hind" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Stay in a century-old haveli, wake up to temple bells, savour authentic awadhi cuisine — and feel the warmth of UP's timeless hospitality.
          </p>

          {/* <div className="animate-fade-4 flex flex-wrap gap-4 mt-10 justify-center">
            <Link to="/rooms" className="bg-saffron text-white text-sm font-hind tracking-widest uppercase px-9 py-3.5 rounded-sm hover:bg-saf-dark hover:-translate-y-0.5 transition-all no-underline" style={{ boxShadow: '0 4px 20px rgba(232,114,28,0.5)' }}>
              Explore Rooms
            </Link>
            <Link to="/booking" className="bg-black text-white text-sm font-hind tracking-widest uppercase px-9 py-3.5 rounded-sm border border-white/50 hover:bg-black hover:border-white transition-all no-underline">
              Book a Stay
            </Link>
          </div> */}
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(232,114,28,0.5), transparent)', zIndex: 2 }} />

        {/* Scroll */}
        <div className="animate-dip absolute md:text-lg bottom-8 flex flex-col items-center gap-1.5 text-[0.6rem] tracking-[0.18em] uppercase font-hind" style={{ color: 'orange', zIndex: 2 }}>
          Scroll Down
          <span className="block w-px h-10 mt-1" style={{ background: 'rgba(255,255,255,0.3)' }} />
        </div>
      </section>

      {/* ── QUICK BOOKING BAR ── */}
      <div className="bg-maroon py-5 px-6 md:px-14">
        <form className="max-w-5xl mx-auto flex flex-wrap md:flex-nowrap gap-3 items-end" onSubmit={e => { e.preventDefault(); window.location.href = '/rooms' }}>
          <DateRangePicker onDateChange={handleDateChange} />
          
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="text-turmeric text-[0.6rem] tracking-widest uppercase font-hind">Guests</label>
            <select className="bg-white/10 border border-white/20 text-white px-3 py-2.5 text-sm rounded-sm outline-none font-hind">
              {['1 Guest', '2 Guests', '3 Guests', '4+ Guests'].map(g => <option key={g} className="bg-maroon">{g}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
            <label className="text-turmeric text-[0.6rem] tracking-widest uppercase font-hind">Room Type</label>
            <select className="bg-white/10 border border-white/20 text-white px-3 py-2.5 text-sm rounded-sm outline-none font-hind">
              <option className="bg-maroon">Any Room</option>
              <option className="bg-maroon">Royal Haveli Suite</option>
              <option className="bg-maroon">Gangamahal Room</option>
              <option className="bg-maroon">Family Kothi</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={!quickBooking.checkin || !quickBooking.checkout}
            className="bg-saffron text-white text-sm font-hind tracking-widest uppercase px-8 py-2.5 rounded-sm hover:bg-saf-dark transition-colors whitespace-nowrap border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-saffron"
          >
            Check Availability
          </button>
        </form>
      </div>

      {/* ── DESTINATIONS ── */}
      {/* <section className="py-20 px-6 md:px-14 bg-ivory">
        <div ref={destRef} className="reveal text-center mb-12">
          <span className="section-label">Why Uttar Pradesh</span>
          <div className="text-saffron text-lg tracking-[0.6rem] opacity-50 my-2">✦ ✦ ✦</div>
          <h2 className="font-serif text-4xl md:text-5xl font-normal">The Heart of <em className="italic text-saffron">Incredible India</em></h2>
          <p className="text-mud-light text-sm leading-relaxed mt-3 max-w-xl mx-auto font-hind">From the Mughal grandeur of Agra to the spiritual ghats of Varanasi — UP is a land where every corner tells a thousand-year-old story.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {destinations.map(d => (
            <div key={d.name} className="group relative overflow-hidden rounded-sm cursor-pointer h-52 md:h-64">
              <img src={d.img} alt={d.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <div className="font-serif text-lg font-semibold leading-tight">{d.name}</div>
                <div className="text-turmeric text-xs font-hind tracking-wider">{d.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* ── ABOUT STRIP ── */}
      {/* <section className="pattern-bg py-20 px-6 md:px-14">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div ref={aboutImgR} className="reveal relative">
            <img src="https://images.unsplash.com/photo-1583340806474-a2fab0a46f9e?w=800&q=80" alt="Heritage Haveli" className="w-full h-72 md:h-96 object-cover rounded-sm shadow-xl" />
            <div className="absolute -bottom-4 -right-4 bg-saffron text-white p-4 text-center rounded-sm shadow-lg">
              <div className="font-serif text-3xl font-bold leading-none"><Counter target={25} suffix="+" /></div>
              <div className="text-[0.6rem] tracking-widest uppercase font-hind mt-1">Years of Heritage</div>
            </div>
          </div>
          <div ref={aboutTxtR} className="reveal">
            <span className="section-label">Our Heritage Home</span>
            <div className="text-saffron text-base opacity-50 tracking-[0.3rem] my-2">✦ ✦ ✦</div>
            <h2 className="font-serif text-3xl md:text-4xl font-normal leading-tight">
              A 19th Century Haveli,<br />Now Your <em className="italic text-saffron">Home</em>
            </h2>
            <p className="text-mud text-sm leading-relaxed mt-4 font-hind">Nestled in the lanes of old Lucknow, our haveli was built in 1887 by Nawab Faiz Ali Khan. Its arched corridors, carved jali windows, and inner courtyards have witnessed a century of UP's rich history — now open to welcome you.</p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              {features.map(f => <div key={f} className="feat-item">{f}</div>)}
            </div>
            <Link to="/about" className="inline-block mt-7 bg-saffron text-white text-sm font-hind tracking-widest uppercase px-8 py-3 rounded-sm hover:bg-saf-dark hover:-translate-y-0.5 transition-all no-underline">Know Our Story</Link>
          </div>
        </div>
      </section> */}

      {/* ── ROOMS PREVIEW ── */}
      <section className="py-20 px-6 md:px-14 bg-ivory">
        <div className="text-center mb-12">
          <span className="section-label">Accommodations</span>
          <div className="text-saffron text-lg tracking-[0.6rem] opacity-50 my-2">✦ ✦ ✦</div>
          <h2 className="font-serif text-4xl md:text-5xl font-normal">Our <em className="italic text-saffron">Rooms & Suites</em></h2>
        </div>
        <div ref={roomsRef} className="reveal grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {rooms.map(r => (
            <div key={r.id} className="bg-white rounded-sm overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 border border-parchment">
              <div className="relative h-52 overflow-hidden">
                <img src={r.img} alt={r.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                {r.badge && <span className={`absolute top-3 left-3 ${r.badgeColor} text-white text-[0.58rem] tracking-widest uppercase px-2.5 py-1 font-hind`}>{r.badge}</span>}
                <span className={`absolute top-3 right-3 ${r.statusColor} text-white text-[0.58rem] tracking-widest uppercase px-2.5 py-1 font-hind`}>{r.status}</span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-semibold">{r.name}</h3>
                <p className="text-mud text-xs leading-relaxed mt-1 mb-3 font-hind">{r.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {r.amenities.map(a => <span key={a} className="amenity-tag">{a}</span>)}
                </div>
                <div className="flex items-center justify-between border-t border-parchment pt-4">
                  <div>
                    <span className="font-serif text-2xl font-semibold text-saffron">{r.price}</span>
                    <span className="text-xs text-mud font-hind"> / night</span>
                  </div>
                  <Link to="/booking" className="bg-saffron text-white text-xs font-hind tracking-wider uppercase px-4 py-2 rounded-sm hover:bg-saf-dark transition-colors no-underline">Book</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/rooms" className="inline-block border border-saffron text-saffron text-sm font-hind tracking-widest uppercase px-10 py-3 rounded-sm hover:bg-saffron hover:text-white transition-all no-underline">View All Rooms</Link>
        </div>
      </section>

      {/* ── GALLERY STRIP ── */}
      <section className="bg-ink py-16 px-4 md:px-10">
        <div className="text-center mb-10">
          <span className="block text-saffron text-[0.65rem] tracking-[0.25em] uppercase font-hind mb-1">Photo Gallery</span>
          <div className="text-turmeric text-lg tracking-[0.6rem] opacity-50 my-2">✦ ✦ ✦</div>
          <h2 className="font-serif text-4xl text-white font-normal">Life at <em className="italic text-turmeric">Haveli Stay</em></h2>
        </div>
        <div ref={galleryRef} className="gallery-grid reveal max-w-5xl mx-auto">
          {[
            { src: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80', large: true, alt: 'Taj Mahal' },
            { src: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80', alt: 'Varanasi' },
            { src: 'https://images.unsplash.com/photo-1583340806474-a2fab0a46f9e?w=600&q=80', alt: 'Haveli' },
            { src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', alt: 'Lucknow' },
            { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', alt: 'Room' },
          ].map((img, i) => (
            <div key={i} className={`gallery-item${img.large ? ' gallery-item--large' : ''}`}>
              <img src={img.src} alt={img.alt} />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/gallery" className="inline-block border border-saffron text-saffron text-sm font-hind tracking-widest uppercase px-10 py-3 rounded-sm hover:bg-saffron hover:text-white transition-all no-underlin">View Full Gallery</Link>
        </div>
      </section>

      {/* ── STATS ── */}
      {/* <section className="bg-saffron py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[{ n: 500, s: '+', l: 'Happy Guests' }, { n: 25, s: '+', l: 'Years Heritage' }, { n: 4, s: ' Cities', l: 'UP Destinations' }, { n: 98, s: '%', l: 'Guest Satisfaction' }].map(stat => (
            <div key={stat.l}>
              <div className="font-serif text-4xl md:text-5xl font-bold text-white"><Counter target={stat.n} suffix={stat.s} /></div>
              <div className="text-white/75 text-xs tracking-widest uppercase mt-1 font-hind">{stat.l}</div>
            </div>
          ))}
        </div>
      </section> */}

      {/* ── REVIEWS ── */}
      <section className="py-20 px-6 md:px-14 bg-parchment">
        <div className="text-center mb-12">
          <span className="section-label">Guest Reviews</span>
          <div className="text-saffron text-lg tracking-[0.6rem] opacity-50 my-2">✦ ✦ ✦</div>
          <h2 className="font-serif text-4xl md:text-5xl font-normal">What Guests <em className="italic text-saffron">Say</em></h2>
        </div>
        <div ref={reviewsRef} className="reveal grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map(r => (
            <div key={r.name} className="bg-ivory p-7 rounded-sm shadow-sm border border-parchment relative">
              <span className="absolute top-1 left-5 font-serif text-[4.5rem] text-mud/10 leading-none">"</span>
              <div className="text-saffron mb-2 text-sm">★★★★★</div>
              <p className="text-mud text-sm leading-relaxed italic mb-5 font-hind">{r.text}</p>
              <div className="flex items-center gap-3">
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full border-2 border-parchment object-cover" />
                <div>
                  <div className="font-semibold text-sm">{r.name}</div>
                  <div className="text-mud-light text-xs font-hind">{r.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUICK INQUIRY ── */}
      <section className="booking-bg py-20 px-6 md:px-14">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="block text-saffron text-[0.65rem] tracking-[0.25em] uppercase font-hind mb-2">Book a Stay</span>
            <div className="text-turmeric text-lg tracking-[0.6rem] opacity-60 my-2">✦ ✦ ✦</div>
            <h2 className="font-serif text-4xl text-white font-normal">Send an <em className="italic text-turmeric">Inquiry</em></h2>
            <p className="text-white/60 text-sm font-hind mt-2">We'll confirm availability and reply within 24 hours.</p>
          </div>
          <div className="text-center">
            <Link to="/booking" className="inline-block bg-saffron text-white text-sm font-hind tracking-widest uppercase px-12 py-4 rounded-sm hover:bg-saf-dark transition-all no-underline" style={{ boxShadow: '0 4px 20px rgba(232,114,28,0.5)' }}>
              Go to Booking Page →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}