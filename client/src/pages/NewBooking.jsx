import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageHeader from '../components/PageHeader';

export default function NewBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [form, setForm] = useState({
    roomId: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    specialRequests: ''
  });
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const { data } = await axios.get('/api/rooms');
      console.log('Rooms fetched:', data);
      if (data.success && data.data) {
        setRooms(data.data);
      } else {
        toast.error('No rooms available');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms. Please refresh the page.');
    } finally {
      setLoadingRooms(false);
    }
  }; 

  const checkAvailability = async () => {
    if (!form.roomId || !form.checkIn || !form.checkOut) return;

    try {
      const { data } = await axios.post('/api/rooms/check-availability', {
        roomId: form.roomId,
        checkIn: form.checkIn,
        checkOut: form.checkOut
      });
      setAvailability(data.data);
      if (!data.data.available) {
        toast.warning('Room not available for selected dates');
      }
    } catch (error) {
      toast.error('Failed to check availability');
    }
  };

  useEffect(() => {
    if (form.roomId && form.checkIn && form.checkOut) {
      checkAvailability();
    }
  }, [form.roomId, form.checkIn, form.checkOut]);

  const selectedRoom = rooms.find(r => r._id === form.roomId);
  const nights = form.checkIn && form.checkOut 
    ? Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24))
    : 0;
  const totalPrice = selectedRoom && nights > 0 ? selectedRoom.price * nights : 0;

  const validateDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(form.checkIn);
    const checkOut = new Date(form.checkOut);

    if (checkIn < today) {
      toast.error('Check-in date must be today or later');
      return false;
    }

    if (checkOut <= checkIn) {
      toast.error('Check-out date must be after check-in date');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateDates()) {
      return;
    }

    if (!availability?.available) {
      toast.error('Room not available for selected dates');
      return;
    }

    if (selectedRoom && parseInt(form.guests) > selectedRoom.capacity) {
      toast.error(`This room can accommodate maximum ${selectedRoom.capacity} guests`);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/bookings', {
        ...form,
        guests: parseInt(form.guests)
      });
      
      setStatus('success');
      toast.success('Booking created successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
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

      <section className="py-16 px-6 md:px-14 bg-ivory">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
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
                <div>
                  <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Select Room *</label>
                  <select
                    name="roomId"
                    required
                    value={form.roomId}
                    onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                    className="form-input-light w-full"
                  >
                    <option value="">Choose a room</option>
                    {rooms.map(room => (
                      <option key={room._id} value={room._id}>
                        {room.name} - ₹{room.price}/night (Capacity: {room.capacity} guests)
                      </option>
                    ))}
                  </select>
                  {rooms.length > 0 && (
                    <p className="text-xs text-mud font-hind mt-1">
                      {rooms.length} room type{rooms.length > 1 ? 's' : ''} available
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Check-in Date *</label>
                    <input
                      type="date"
                      name="checkIn"
                      required
                      min={today}
                      value={form.checkIn}
                      onChange={(e) => {
                        const newCheckIn = e.target.value;
                        setForm({ 
                          ...form, 
                          checkIn: newCheckIn,
                          checkOut: form.checkOut && form.checkOut <= newCheckIn ? '' : form.checkOut
                        });
                      }}
                      className="form-input-light w-full"
                    />
                    <p className="text-xs text-mud font-hind mt-1">Must be today or later</p>
                  </div>

                  <div>
                    <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Check-out Date *</label>
                    <input
                      type="date"
                      name="checkOut"
                      required
                      min={form.checkIn ? new Date(new Date(form.checkIn).getTime() + 86400000).toISOString().split('T')[0] : today}
                      value={form.checkOut}
                      onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                      className="form-input-light w-full"
                      disabled={!form.checkIn}
                    />
                    <p className="text-xs text-mud font-hind mt-1">
                      {form.checkIn ? 'Must be after check-in' : 'Select check-in first'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Number of Guests *</label>
                  <select
                    name="guests"
                    required
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    className="form-input-light w-full"
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option 
                        key={n} 
                        value={n}
                        disabled={selectedRoom && n > selectedRoom.capacity}
                      >
                        {n} Guest{n > 1 ? 's' : ''}
                        {selectedRoom && n > selectedRoom.capacity ? ' (Exceeds capacity)' : ''}
                      </option>
                    ))}
                  </select>
                  {selectedRoom && (
                    <p className="text-xs text-mud font-hind mt-1">
                      Maximum capacity: {selectedRoom.capacity} guests
                    </p>
                  )}
                </div>

                {form.roomId && form.checkIn && form.checkOut && (
                  <div className="bg-blue-50 border border-blue-300 p-4 rounded-sm">
                    <p className="text-sm font-hind text-blue-800 mb-2">
                      🔍 Checking availability...
                    </p>
                    {availability && (
                      <div className={`p-3 rounded-sm mt-2 ${availability.available ? 'bg-green-50 border border-green-300' : 'bg-red-50 border border-red-300'}`}>
                        <p className={`text-sm font-hind font-semibold ${availability.available ? 'text-green-800' : 'text-red-800'}`}>
                          {availability.available 
                            ? `✓ Available! (${availability.availableCount} of ${availability.totalInventory} rooms available)`
                            : `✕ Not available for selected dates (${availability.totalInventory} total rooms, all booked)`}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-mud text-xs tracking-widest uppercase font-hind mb-1">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    rows={4}
                    placeholder="Dietary needs, local tours, special occasions..."
                    value={form.specialRequests}
                    onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                    className="form-input-light w-full resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !availability?.available || !form.roomId || !form.checkIn || !form.checkOut || !form.guests}
                  className="w-full bg-saffron text-white text-sm font-hind tracking-widest uppercase py-3.5 rounded-sm hover:bg-saf-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Booking...' : 
                   !form.roomId || !form.checkIn || !form.checkOut || !form.guests ? 'Fill all required fields' :
                   !availability ? 'Checking availability...' :
                   !availability.available ? 'Room not available' :
                   `Confirm Booking - ₹${totalPrice}`}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-5">
            {selectedRoom && (
              <div className="bg-white p-5 rounded-sm border border-warm shadow-sm">
                <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-32 object-cover rounded-sm mb-3" />
                <h3 className="font-serif text-lg font-semibold mb-2">{selectedRoom.name}</h3>
                <p className="text-mud text-xs font-hind mb-3">{selectedRoom.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedRoom.amenities?.slice(0, 4).map(a => (
                    <span key={a} className="amenity-tag text-xs">{a}</span>
                  ))}
                </div>
                <div className="border-t border-parchment pt-3">
                  <div className="flex justify-between text-sm font-hind mb-1">
                    <span className="text-mud">Price per night:</span>
                    <span className="font-semibold">₹{selectedRoom.price}</span>
                  </div>
                  {nights > 0 && (
                    <>
                      <div className="flex justify-between text-sm font-hind mb-1">
                        <span className="text-mud">Nights:</span>
                        <span className="font-semibold">{nights}</span>
                      </div>
                      <div className="flex justify-between text-lg font-serif border-t border-parchment pt-2 mt-2">
                        <span>Total:</span>
                        <span className="text-saffron font-bold">₹{totalPrice}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="bg-parchment p-5 rounded-sm border border-warm">
              <h3 className="font-serif text-lg font-semibold mb-3">What's Included</h3>
              <ul className="space-y-1.5 list-none">
                {['Daily breakfast', 'Airport pickup', 'Heritage tour', 'Free WiFi', '24/7 support'].map(f => (
                  <li key={f} className="feat-item text-sm">{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
