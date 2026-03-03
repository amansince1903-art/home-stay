import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageHeader from '../components/PageHeader';
import GuestSelector from '../components/GuestSelector';
import RoomSelector from '../components/RoomSelector';

/* ── Amenities Data by Category ── */
const amenitiesByCategory = [
  {
    category: 'Bathroom',
    items: [
      { icon: '🚿', label: 'Hot Water' },
      { icon: '🧴', label: 'Shampoo & Conditioner' },
      { icon: '🧼', label: 'Body Soap' },
      { icon: '🪥', label: 'Cleaning Products' },
      { icon: '💆', label: 'Hairdryer' },
    ]
  },
  {
    category: 'Bedroom',
    items: [
      { icon: '🛏', label: 'Fresh Linen & Towels' },
      { icon: '❄️', label: 'Air Conditioning' },
      { icon: '📺', label: 'TV in Room' },
      { icon: '🔒', label: 'Locker / Safe' },
      { icon: '🪟', label: 'Courtyard View' },
    ]
  },
  {
    category: 'Services',
    items: [
      { icon: '🍳', label: 'Daily Breakfast (Awadhi)' },
      { icon: '🚗', label: 'Airport / Station Pickup' },
      { icon: '🏛', label: 'Heritage Walking Tour' },
      { icon: '🎭', label: 'Cultural Performances' },
      { icon: '🧹', label: 'Daily Housekeeping' },
    ]
  },
  {
    category: 'Property',
    items: [
      { icon: '📶', label: 'Free WiFi' },
      { icon: '🌿', label: 'Garden Access' },
      { icon: '⛲', label: 'Courtyard with Fountain' },
      { icon: '🅿️', label: 'Free Parking' },
      { icon: '🛎', label: '24/7 Host Support' },
    ]
  },
]

const allAmenities = amenitiesByCategory.flatMap(c => c.items)

/* ── Amenities Modal ── */
function AmenitiesModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-serif text-xl font-semibold">What this place offers</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors bg-transparent border-none cursor-pointer text-lg">✕</button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {amenitiesByCategory.map(({ category, items }) => (
            <div key={category} className="mb-6">
              <h3 className="font-serif text-base font-semibold text-ink mb-3">{category}</h3>
              <div className="space-y-0 divide-y divide-gray-100">
                {items.map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-4 py-3">
                    <span className="text-2xl w-8 text-center">{icon}</span>
                    <span className="text-sm font-hind text-ink">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="w-full bg-ink text-white text-sm font-hind tracking-wider uppercase py-3 rounded-lg hover:bg-gray-800 transition-colors border-none cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NewBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false)
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [form, setForm] = useState({
    numberOfRooms: 1,
    checkIn: '',
    checkOut: '',
    guests: { adults: 2, children: 0, infants: 0 },
    specialRequests: '',
    // Guest information (for non-logged-in users)
    guestName: '',
    guestEmail: '',
    guestPhone: ''
  });
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');

  const today = new Date().toISOString().split('T')[0];
  const isGuestBooking = !user;

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const { data } = await axios.get('/api/rooms');
      if (data.success && data.data) setRooms(data.data);
      else toast.error('No rooms available');
    } catch (error) {
      toast.error('Failed to load rooms. Please refresh the page.');
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
  const checkRealAvailability = async () => {
    if (!form.numberOfRooms || !form.checkIn || !form.checkOut) return

    // Adults capacity warning
    const roomCapacity = rooms.length > 0 ? rooms[0].capacity : 2
    const maxAdults = parseInt(form.numberOfRooms) * roomCapacity
    if (form.guests.adults > maxAdults) {
      toast.warning(`${form.numberOfRooms} room(s) can accommodate max ${maxAdults} adults`)
    }

    try {
      const { data } = await axios.get(`/api/rooms/availability`, {
        params: {
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          numberOfRooms: form.numberOfRooms
        }
      })
      setAvailability({
        available: data.available,
        availableRooms: data.availableRooms,
        totalRooms: data.totalRooms
      })
    } catch {
      // fallback to inventory check
      const availableCount = rooms.filter(r => r.inventory > 0).length
      setAvailability({
        available: parseInt(form.numberOfRooms) <= availableCount,
        availableRooms: availableCount,
        totalRooms: rooms.length
      })
    }
  }
  checkRealAvailability()
}, [form.numberOfRooms, form.checkIn, form.checkOut, form.guests.adults, rooms]);

  const nights = form.checkIn && form.checkOut
    ? Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24)) : 0;
  const avgRoomPrice = rooms.length > 0
    ? rooms.reduce((sum, room) => sum + room.price, 0) / rooms.length : 0;

  // ✅ Only adults count for capacity — children & infants are FREE/excluded
  const adults = form.guests.adults
  const children = form.guests.children
  const infants = form.guests.infants

  const totalPrice = form.numberOfRooms && nights > 0
    ? Math.round(avgRoomPrice * parseInt(form.numberOfRooms) * nights) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const todayDate = new Date(); todayDate.setHours(0,0,0,0);
    const checkIn = new Date(form.checkIn);
    const checkOut = new Date(form.checkOut);
    if (checkIn < todayDate) { toast.error('Check-in must be today or later'); return; }
    if (checkOut <= checkIn) { toast.error('Check-out must be after check-in'); return; }
    if (!availability?.available) { toast.error('Not enough rooms available'); return; }
    
    // Validate guest information if not logged in
    if (isGuestBooking) {
      if (!form.guestName || !form.guestEmail || !form.guestPhone) {
        toast.error('Please fill in your contact information');
        return;
      }
    }
    
    setLoading(true);
    try {
      const availableRoom = rooms.find(r => r.inventory > 0);
      const bookingData = {
        roomId: availableRoom._id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        numberOfRooms: parseInt(form.numberOfRooms), 
        guests: adults, // ✅ only adults sent for capacity check
        specialRequests: form.specialRequests
      };
      
      // Add guest information if not logged in
      if (isGuestBooking) {
        bookingData.guestName = form.guestName;
        bookingData.guestEmail = form.guestEmail;
        bookingData.guestPhone = form.guestPhone;
      }
      
      await axios.post('/api/bookings', bookingData);
      setStatus('success');
      toast.success('Booking created successfully! Check your email for confirmation.');
      
      // Redirect based on user type
      setTimeout(() => {
        if (isGuestBooking) {
          navigate('/'); // Guest goes to home
        } else {
          navigate('/dashboard'); // Logged-in user goes to dashboard
        }
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        label="Reserve Your Stay"
        title='Book Your <em class="italic" style="color:#F2A830;">Heritage Stay</em>'
        subtitle="Create your booking with real-time availability"
      />

      {showAmenitiesModal && <AmenitiesModal onClose={() => setShowAmenitiesModal(false)} />}

      <section className="py-16 px-6 md:px-14 bg-ivory">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">

          {/* ── FORM ── */}
          <div className="md:col-span-2">
            <h2 className="font-serif text-2xl font-normal mb-6">Booking Details</h2>

            {status === 'success' ? (
              <div className="bg-green-50 border border-green-300 text-green-800 px-6 py-8 rounded-sm text-center">
                <div className="text-4xl mb-3">🙏</div>
                <h3 className="font-serif text-xl mb-2">Booking Confirmed!</h3>
                <p className="font-hind text-sm">Your booking has been created. Redirecting to dashboard...</p>
              </div>
            ) : loadingRooms ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-mud font-hind">Loading rooms...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-12 bg-red-50 border border-red-300 rounded-sm">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-red-800 font-hind mb-2">No rooms available</p>
                <p className="text-sm text-mud font-hind">Please contact us or try again later</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                <RoomSelector onChange={(r) => setForm({ ...form, numberOfRooms: r })} variant="light" />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Check-in Date *</label>
                    <input type="date" name="checkIn" required min={today} value={form.checkIn}
                      onChange={(e) => {
                        const newCheckIn = e.target.value;
                        setForm({ ...form, checkIn: newCheckIn, checkOut: form.checkOut && form.checkOut <= newCheckIn ? '' : form.checkOut });
                      }}
                      className="form-input-light w-full" />
                    <p className="text-xs text-mud font-hind mt-1">Must be today or later</p>
                  </div>
                  <div>
                    <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Check-out Date *</label>
                    <input type="date" name="checkOut" required
                      min={form.checkIn ? new Date(new Date(form.checkIn).getTime() + 86400000).toISOString().split('T')[0] : today}
                      value={form.checkOut}
                      onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                      className="form-input-light w-full" disabled={!form.checkIn} />
                    <p className="text-xs text-mud font-hind mt-1">{form.checkIn ? 'Must be after check-in' : 'Select check-in first'}</p>
                  </div>
                </div>

                <GuestSelector onChange={(g) => setForm({ ...form, guests: g })} variant="light" />

                {/* Guest Information (for non-logged-in users) */}
                {isGuestBooking && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-sm p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-amber-600 text-lg">👤</span>
                      <h3 className="font-serif text-base font-semibold text-amber-900">Your Contact Information</h3>
                    </div>
                    <div>
                      <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter your full name"
                        value={form.guestName}
                        onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                        className="form-input-light w-full" 
                      />
                    </div>
                    <div>
                      <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="your.email@example.com"
                        value={form.guestEmail}
                        onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                        className="form-input-light w-full" 
                      />
                      <p className="text-xs text-amber-700 font-hind mt-1">Booking confirmation will be sent here</p>
                    </div>
                    <div>
                      <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+91 91295 86522"
                        value={form.guestPhone}
                        onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
                        className="form-input-light w-full" 
                      />
                    </div>
                    <p className="text-xs text-amber-700 font-hind">
                      💡 <Link to="/register" className="underline hover:text-amber-900">Create an account</Link> to track your bookings easily
                    </p>
                  </div>
                )}

                {form.numberOfRooms && form.checkIn && form.checkOut && (
                  <div className="bg-blue-50 border border-blue-300 p-4 rounded-sm">
                    <p className="text-sm font-hind text-blue-800 mb-2">🔍 Checking availability...</p>
                    {availability && (
                      <div className={`p-3 rounded-sm mt-2 ${availability.available ? 'bg-green-50 border border-green-300' : 'bg-red-50 border border-red-300'}`}>
                        <p className={`text-sm font-hind font-semibold ${availability.available ? 'text-green-800' : 'text-red-800'}`}>
                          {availability.available
                            ? `✓ Available! (${availability.availableRooms} of ${availability.totalRooms} rooms available)`
                            : `✕ Only ${availability.availableRooms} available, you requested ${form.numberOfRooms}`}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Special Requests</label>
                  <textarea rows={4} placeholder="Dietary needs, local tours, special occasions..."
                    value={form.specialRequests}
                    onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                    className="form-input-light w-full resize-y" />
                </div>

                <button type="submit"
                  disabled={loading || !availability?.available || !form.checkIn || !form.checkOut || adults === 0}
                  className="w-full bg-saffron text-white text-sm font-hind tracking-widest uppercase py-3.5 rounded-sm hover:bg-saf-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed border-none cursor-pointer"
                >
                  {loading ? 'Creating Booking...' :
                   !form.checkIn || !form.checkOut || adults === 0 ? 'Fill all required fields' :
                   !availability ? 'Checking availability...' :
                   !availability.available ? 'Not enough rooms available' :
                   `Confirm Booking - ₹${totalPrice.toLocaleString()}`}
                </button>
              </form>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-5">

            {/* Booking Summary */}
            {form.numberOfRooms && nights > 0 && (
              <div className="bg-white p-5 rounded-sm border border-parchment shadow-sm">
                <h3 className="font-serif text-lg font-semibold mb-3">Booking Summary</h3>
                <div className="space-y-2">
                  {[
                    ['Rooms', form.numberOfRooms],
                    ['Adults', adults],
                    ...(children > 0 ? [['Children', children]] : []),
                    ...(infants > 0 ? [['Infants', infants]] : []),
                    ['Nights', nights],
                    ['Avg. price/room/night', '₹' + Math.round(avgRoomPrice).toLocaleString()],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm font-hind">
                      <span className="text-mud">{label}:</span>
                      <span className="font-semibold">{val}</span>
                    </div>
                  ))}
                  {(children > 0 || infants > 0) && (
                    <p className="text-xs text-mud font-hind italic">* Children & infants stay free</p>
                  )}
                  <div className="flex justify-between text-lg font-serif border-t border-parchment pt-2 mt-2">
                    <span>Total:</span>
                    <span className="text-saffron font-bold">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Amenities */}
            <div className="bg-white p-5 rounded-sm border border-parchment shadow-sm">
              <h3 className="font-serif text-lg font-semibold mb-4">What this place offers</h3>
              <div className="divide-y divide-gray-100">
                {allAmenities.slice(0, 6).map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3 py-3">
                    <span className="text-xl w-7 text-center">{icon}</span>
                    <span className="text-sm font-hind text-ink">{label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowAmenitiesModal(true)}
                className="mt-4 w-full border border-gray-800 text-ink text-xs font-hind tracking-wider uppercase py-2.5 rounded-lg hover:bg-gray-50 transition-colors bg-transparent cursor-pointer"
              >
                Show all {allAmenities.length} amenities
              </button>
            </div>

            {/* Need Help */}
            <div className="bg-maroon p-5 rounded-sm text-white">
              <h3 className="font-serif text-lg mb-2">Need Help?</h3>
              <p className="text-white/70 text-xs font-hind mb-3">Call or WhatsApp us for instant confirmation.</p>
              <a href="tel:+919876543210" className="block text-center bg-saffron text-white text-xs font-hind tracking-widest uppercase py-2.5 rounded-sm hover:bg-saf-dark transition-colors no-underline">
                📞 Call Now
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}