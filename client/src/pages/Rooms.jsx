import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import useReveal from '../components/useReveal'

const rooms = [
  {
    id: 1, name: 'Royal Haveli Suite', price: '₹2,500',
    capacity: '2 Guests', badge: 'Most Popular', badgeColor: 'bg-saffron',
    status: 'Available', statusColor: 'bg-forest',
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    desc: 'A grand suite with traditional Mughal arches, hand-painted walls, and a private courtyard view. Experience the grandeur of old UP nobility from the comfort of modern amenities.',
    amenities: ['King Bed', 'AC + Heater', 'Free WiFi', 'Courtyard View', 'Breakfast Included', 'Private Bath'],
  },
  {
    id: 2, name: 'Gangamahal Room', price: '₹1,800',
    capacity: '2 Guests', badge: null, badgeColor: '',
    status: 'Available', statusColor: 'bg-forest',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    desc: 'Overlooking the sacred Ganga with a wooden balcony, antique furniture, and serene views. Wake up to the sounds of aarti and river boats — a deeply spiritual experience.',
    amenities: ['Double Bed', 'AC', 'Free WiFi', 'Ganga View', 'Breakfast Included', 'Balcony'],
  },
  {
    id: 3, name: 'Family Kothi', price: '₹4,200',
    capacity: 'Up to 6 Guests', badge: null, badgeColor: '',
    status: 'Only 1 Left', statusColor: 'bg-maroon',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    desc: 'A spacious 3-room kothi with a private kitchen, sit-out garden, and authentic UP home cooking prepared by our host family. Perfect for family gatherings and extended stays.',
    amenities: ['3 Bedrooms', 'Private Kitchen', 'Garden', 'AC in all rooms', 'All Meals Included', 'Free WiFi'],
  },
]

function RoomCard({ room, reverse }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="reveal grid md:grid-cols-2 gap-8 items-center bg-white rounded-sm shadow-md overflow-hidden border border-parchment">
      <div className={`relative h-72 md:h-full overflow-hidden ${reverse ? 'md:order-2' : ''}`}>
        <img src={room.img} alt={room.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        {room.badge && <span className={`absolute top-4 left-4 ${room.badgeColor} text-white text-[0.58rem] tracking-widest uppercase px-3 py-1 font-hind`}>{room.badge}</span>}
        <span className={`absolute top-4 right-4 ${room.statusColor} text-white text-[0.58rem] tracking-widest uppercase px-3 py-1 font-hind`}>{room.status}</span>
      </div>
      <div className={`p-7 ${reverse ? 'md:order-1' : ''}`}>
        <span className="section-label">{room.capacity}</span>
        <h2 className="font-serif text-2xl font-semibold mt-1">{room.name}</h2>
        <p className="text-mud text-sm leading-relaxed mt-2 font-hind">{room.desc}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {room.amenities.map(a => <span key={a} className="amenity-tag">{a}</span>)}
        </div>
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-parchment">
          <div>
            <span className="font-serif text-3xl font-bold text-saffron">{room.price}</span>
            <span className="text-xs text-mud font-hind"> / night</span>
          </div>
          <Link to="/booking" className="bg-saffron text-white text-sm font-hind tracking-widest uppercase px-6 py-2.5 rounded-sm hover:bg-saf-dark transition-colors no-underline">Book This Room</Link>
        </div>
      </div>
    </div>
  )
}

export default function Rooms() {
  return (
    <>
      <PageHeader
        label="Accommodations"
        title='Our <em class="italic" style="color:#F2A830;">Rooms & Suites</em>'
        subtitle="Each room is a blend of century-old heritage architecture and modern comfort, crafted to give you an authentic UP experience."
      />
      <section className="py-16 px-6 md:px-14 bg-ivory">
        <div className="max-w-5xl mx-auto space-y-12">
          {rooms.map((room, i) => <RoomCard key={room.id} room={room} reverse={i % 2 === 1} />)}
        </div>
      </section>
    </>
  )
}