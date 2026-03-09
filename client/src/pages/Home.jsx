import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import GuestSelector from '../components/GuestSelector'
import RoomSelector from '../components/RoomSelector'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import useReveal from '../components/useReveal'
import DateRangePicker from '../components/DateRangePicker'

// Import local gallery images
import galleryImage from '../assets/images/gallery image.jpg'
import gallery2 from '../assets/images/gallery 2.jpg'
import haveliOutdoor from '../assets/images/haveli outdoor.jpg'
import outdoor1 from '../assets/images/outdoor  1.jpg'
import outdoor2 from '../assets/images/outdoor 2.jpg'
import daisyStay3 from '../assets/images/daisy stay 3.jpg'
import d2 from '../assets/images/d2.jpeg'
import d3 from '../assets/images/d3.png'
import d4 from '../assets/images/d4.jpg'

// Import local room images
import room1 from '../assets/images/room 1.jpg'
import room2 from '../assets/images/room 2.png'
import room3 from '../assets/images/room 3.jpg'
import room4 from '../assets/images/room 4.png'
import room5 from '../assets/images/room 5.png'
import room6 from '../assets/images/-room 6.jpg'
import room7 from '../assets/images/d2.jpeg'
import room8 from '../assets/images/d3.png'
import room9 from '../assets/images/daisy stay 3.jpg'

const roomImages = {
  'Bedroom 1': room1,
  'Bedroom 2': room2,
  'Bedroom 3': room3,
  'Bedroom 4': room4,
  'Bedroom 5': room5,
  'Bedroom 6': room6
}

const reviews = [
  { name: 'Priya Malhotra',       loc: 'Delhi · 4 nights',       avatar: 'https://i.pravatar.cc/60?img=22', text: 'DAISY DALE is a hidden gem in Dehradun. The mountain views, the warmth of the family, and the homemade meals made us feel truly at home. A perfect escape from city life!' },
  { name: 'Arjun & Meera Kapoor', loc: 'Mumbai · 6 nights',      avatar: 'https://i.pravatar.cc/60?img=55', text: 'The peaceful mornings with sunrise views and evening tea in the garden were magical. The hosts shared beautiful stories of their Army legacy. Highly recommend!' },
  { name: 'David Thompson',        loc: 'London, UK · 5 nights',  avatar: 'https://i.pravatar.cc/60?img=38', text: 'As a solo traveler, I felt completely safe and welcomed. The personal attention, local recommendations, and authentic hospitality made my Dehradun trip unforgettable!' },
]

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
  const navigate = useNavigate()
  const heroImages = [room7, room8, room9]
  const [currentImg, setCurrentImg] = useState(0)

  const destRef    = useReveal()
  const roomsRef   = useReveal()
  const galleryRef = useReveal()
  const reviewsRef = useReveal()

  const [quickBooking, setQuickBooking] = useState({ checkin: '', checkout: '' })
  const [guestData, setGuestData] = useState({ adults: 2, children: 0, infants: 0 })
  const [roomCount, setRoomCount] = useState(1)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  // ── Hero slideshow
  useEffect(() => {
    heroImages.forEach(src => { const img = new Image(); img.src = src }) // preload
    const timer = setInterval(() => {
      setCurrentImg(i => (i + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // ── Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/api/rooms')
        const roomsData = response.data.data.map(room => ({
          id: room._id,
          name: room.name,
          price: `₹${room.price.toLocaleString()}`,
          badge: room.name === 'Bedroom 1' ? 'Most Popular' : null,
          badgeColor: room.name === 'Bedroom 1' ? 'bg-saffron' : '',
          status: room.inventory > 1 ? 'Available' : `${room.inventory} Left`,
          statusColor: room.inventory > 1 ? 'bg-forest' : 'bg-maroon',
          img: roomImages[room.name] || room.image,
          desc: room.description,
          amenities: room.amenities.slice(0, 4)
        }))
        setRooms(roomsData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching rooms:', error)
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  const handleDateChange = (dates) => {
    setQuickBooking({ checkin: dates.checkIn, checkout: dates.checkOut })
  }

  // ── Build URL params and navigate
  const handleCheckAvailability = (e) => {
    e.preventDefault()
    const params = new URLSearchParams({
      checkIn:  quickBooking.checkin  || '',
      checkOut: quickBooking.checkout || '',
      adults:   guestData.adults,
      children: guestData.children,
      infants:  guestData.infants,
      rooms:    roomCount
    })
    console.log("params",params)
    navigate(`/rooms?${params}`)
  }

  // ── Build booking URL with current params (for room cards)
  const bookingUrl = () => {
    const params = new URLSearchParams({
      checkIn:  quickBooking.checkin  || '',
      checkOut: quickBooking.checkout || '',
      adults:   guestData.adults,
      children: guestData.children,
      infants:  guestData.infants,
      rooms:    roomCount
    })
    return `/booking?${params}`
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden" style={{ backgroundColor: '#120a06' }}>
        {/* Current image */}
        <div className="hero-bg absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(20,12,8,0.55) 0%, rgba(20,12,8,0.25) 40%, rgba(161,61,11,0.25) 65%, rgba(20,12,8,0.70) 100%),
            url(${heroImages[currentImg]})
          `,
          opacity: 1,
          transition: 'opacity 1s ease-in-out'
        }} />
        {/* Next image preloaded underneath */}
        <div className="hero-bg absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(20,12,8,0.55) 0%, rgba(20,12,8,0.25) 40%, rgba(161,61,11,0.25) 65%, rgba(20,12,8,0.70) 100%),
            url(${heroImages[(currentImg + 1) % heroImages.length]})
          `,
          opacity: 0
        }} />

        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <div style={{ width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,114,28,0.15) 0%, transparent 70%)' }} />
        </div>

        <div className="relative flex flex-col items-center" style={{ zIndex: 2 }}>
          <div className="animate-fade-1 text-turmeric text-xl tracking-[0.8rem] mb-5" style={{ opacity: 0.9 }}>❖ ❖ ❖</div>
          <span className="animate-fade-1 inline-block text-saffron text-[1rem] tracking-[0.25em] uppercase px-5 py-1.5 mb-6 font-hind" style={{ background: 'black' }}>
            Dehradun · Mountain Homestay
          </span>
          <h1 className="animate-fade-2 font-serif font-normal text-white leading-[1.1] text-5xl md:text-7xl" style={{ textShadow: '0 2px 40px rgba(0,0,0,0.8)' }}>
            A Home with a Story<br />
            <em className="italic" style={{ color: '#F2A830' }}>in the Hills of Dehradun</em>
          </h1>
          <p className="animate-fade-3 text-base md:text-lg max-w-xl mt-5 leading-relaxed font-hind" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Nestled in the peaceful foothills of Dehradun, DAISY DALE is a living tribute to legacy, warmth, and quiet mountain hospitality — where guests are welcomed as family.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(232,114,28,0.5), transparent)', zIndex: 2 }} />
        <div className="animate-dip absolute md:text-lg bottom-8 flex flex-col items-center gap-1.5 text-[0.6rem] tracking-[0.18em] uppercase font-hind" style={{ color: 'orange', zIndex: 2 }}>
          Scroll Down
          <span className="block w-px h-10 mt-1" style={{ background: 'rgba(255,255,255,0.3)' }} />
        </div>
      </section>

      {/* ── QUICK BOOKING BAR ── */}
      <div className="bg-maroon py-5 px-6 md:px-14">
        <form className="max-w-5xl mx-auto flex flex-wrap md:flex-nowrap gap-3 items-end" onSubmit={handleCheckAvailability}>
          <DateRangePicker onDateChange={handleDateChange} />
          <GuestSelector onChange={(g) => setGuestData(g)} />
          <RoomSelector onChange={(r) => setRoomCount(r)} />
          <button
            type="submit"
            disabled={!quickBooking.checkin || !quickBooking.checkout}
            className="bg-saffron text-white text-sm font-hind tracking-widest uppercase px-8 py-2.5 rounded-sm hover:bg-saf-dark transition-colors whitespace-nowrap border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-saffron"
          >
            Check Availability
          </button>
        </form>
      </div>

      {/* ── ROOMS PREVIEW ── */}
      <section className="py-20 px-6 md:px-14 bg-ivory">
        <div className="text-center mb-12">
          <span className="section-label">Accommodations</span>
          <div className="text-saffron text-lg tracking-[0.6rem] opacity-50 my-2">✦ ✦ ✦</div>
          <h2 className="font-serif text-4xl md:text-5xl font-normal">Our <em className="italic text-saffron">Rooms & Suites</em></h2>
        </div>
        <div ref={roomsRef} className="reveal max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12"><p className="text-mud font-hind">Loading rooms...</p></div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12"><p className="text-mud font-hind">No rooms available</p></div>
          ) : (
            <Swiper
              key="rooms-swiper"
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              className="rooms-swiper"
            >
              {rooms.map(r => (
                <SwiperSlide key={r.id}>
                  <div className="bg-white rounded-sm overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 border border-parchment h-full">
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
                        {/* ✅ Passes dates + guests to booking page */}
                        <Link to={bookingUrl()} className="bg-saffron text-white text-xs font-hind tracking-wider uppercase px-4 py-2 rounded-sm hover:bg-saf-dark transition-colors no-underline">Book</Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
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
          <h2 className="font-serif text-4xl text-white font-normal">Life at <em className="italic text-turmeric">DAISY DALE</em></h2>
        </div>
        <div ref={galleryRef} className="gallery-grid reveal max-w-5xl mx-auto">
          {[
            { src: daisyStay3, large: true, alt: 'DAISY DALE Exterior' },
            { src: d2, alt: 'DAISY DALE Mountain View' },
            { src: d3, alt: 'DAISY DALE Garden' },
            { src: d4, alt: 'DAISY DALE Property' },
            { src: outdoor1, alt: 'Outdoor Seating Area' },
            { src: gallery2, alt: 'Property View' },
          ].map((img, i) => (
            <div key={i} className={`gallery-item${img.large ? ' gallery-item--large' : ''}`}>
              <img src={img.src} alt={img.alt} />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/gallery" className="inline-block border border-saffron text-saffron text-sm font-hind tracking-widest uppercase px-10 py-3 rounded-sm hover:bg-saffron hover:text-white transition-all no-underline">View Full Gallery</Link>
        </div>
      </section>

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
            <Link to="/contact" className="inline-block bg-saffron text-white text-sm font-hind tracking-widest uppercase px-12 py-4 rounded-sm hover:bg-saf-dark transition-all no-underline" style={{ boxShadow: '0 4px 20px rgba(232,114,28,0.5)' }}>
              Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}