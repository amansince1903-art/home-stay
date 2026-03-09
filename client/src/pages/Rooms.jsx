import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import PageHeader from '../components/PageHeader'
import useReveal from '../components/useReveal'

// Import local room images
import room1 from '../assets/images/room 1.jpg'
import room2 from '../assets/images/room 2.png'
import room3 from '../assets/images/room 3.jpg'
import room4 from '../assets/images/room 4.png'
import room5 from '../assets/images/room 5.png'
import room6 from '../assets/images/-room 6.jpg'

// Map room images by bedroom number
const roomImages = {
  'Bedroom 1': room1,
  'Bedroom 2': room2,
  'Bedroom 3': room3,
  'Bedroom 4': room4,
  'Bedroom 5': room5,
  'Bedroom 6': room6
}

function RoomCard({ room, reverse, searchParams }) {
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
          <Link to={`/booking${searchParams}`} className="bg-saffron text-white text-sm font-hind tracking-widest uppercase px-6 py-2.5 rounded-sm hover:bg-saf-dark transition-colors no-underline">Book This Room</Link>
        </div>
      </div>
    </div>
  )
}

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()        
  const searchParams = location.search  

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/api/rooms')
        const roomsData = response.data.data.map(room => ({
          id: room._id,
          name: room.name,
          price: `₹${room.price.toLocaleString()}`,
          capacity: `Up to ${room.capacity} Guest${room.capacity > 1 ? 's' : ''}`,
          badge: room.name === 'Bedroom 1' ? 'Most Popular' : null,
          badgeColor: room.name === 'Bedroom 1' ? 'bg-saffron' : '',
          status: room.inventory > 1 ? 'Available' : `Only ${room.inventory} Left`,
          statusColor: room.inventory > 1 ? 'bg-forest' : 'bg-maroon',
          img: roomImages[room.name] || room.image, // Use local image if available
          desc: room.description,
          amenities: room.amenities
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

  return (
    <>
      <PageHeader
        label="Accommodations"
        title='Our <em class="italic" style="color:#F2A830;">Rooms & Suites</em>'
        subtitle="Each room is a blend of century-old heritage architecture and modern comfort, crafted to give you an authentic UP experience."
      />
      <section className="py-16 px-6 md:px-14 bg-ivory">
        <div className="max-w-5xl mx-auto space-y-12">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-mud font-hind text-lg">Loading rooms...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-mud font-hind text-lg">No rooms available</p>
            </div>
          ) : (
           rooms.map((room, i) => <RoomCard key={room.id} room={room} reverse={i % 2 === 1} searchParams={searchParams} />)
          )}
        </div>
      </section>
    </>
  )
}