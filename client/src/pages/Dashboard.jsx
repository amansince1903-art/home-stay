import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/my-bookings');
      setBookings(data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await axios.put(`/api/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      'checked-in': 'bg-blue-100 text-blue-800',
      'checked-out': 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-ivory py-20 px-6 md:px-14">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-ink mb-2">My Dashboard</h1>
          <p className="text-mud font-hind">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-parchment">
            <div className="text-saffron text-3xl mb-2">📅</div>
            <div className="font-serif text-2xl">{bookings.length}</div>
            <div className="text-mud text-xs font-hind">Total Bookings</div>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm border border-parchment">
            <div className="text-saffron text-3xl mb-2">✓</div>
            <div className="font-serif text-2xl">{bookings.filter(b => b.status === 'confirmed').length}</div>
            <div className="text-mud text-xs font-hind">Confirmed</div>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm border border-parchment">
            <div className="text-saffron text-3xl mb-2">⏳</div>
            <div className="font-serif text-2xl">{bookings.filter(b => b.status === 'pending').length}</div>
            <div className="text-mud text-xs font-hind">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm border border-parchment">
            <div className="text-saffron text-3xl mb-2">✕</div>
            <div className="font-serif text-2xl">{bookings.filter(b => b.status === 'cancelled').length}</div>
            <div className="text-mud text-xs font-hind">Cancelled</div>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-parchment p-6">
          <h2 className="font-serif text-2xl mb-6">My Bookings</h2>

          {loading ? (
            <p className="text-center text-mud font-hind py-8">Loading...</p>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏨</div>
              <p className="text-mud font-hind mb-4">No bookings yet</p>
              <Link to="/rooms" className="inline-block bg-saffron text-white text-sm font-hind tracking-widest uppercase px-6 py-2.5 rounded-sm hover:bg-saf-dark transition-colors no-underline">
                Browse Rooms
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking._id} className="border border-parchment rounded-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap gap-4 items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {booking.room?.image && (
                        <img src={booking.room.image} alt={booking.room.name} className="w-24 h-24 object-cover rounded-sm" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-serif text-lg mb-1">{booking.room?.name} {booking.numberOfRooms > 1 && `× ${booking.numberOfRooms}`}</h3>
                        <div className="text-sm text-mud font-hind space-y-1">
                          <p>📅 {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p>
                          <p>🏠 {booking.numberOfRooms || 1} room{(booking.numberOfRooms || 1) > 1 ? 's' : ''}</p>
                          <p>👥 {booking.guests} guests</p>
                          <p>💰 ₹{booking.totalPrice.toLocaleString()}</p>
                          <p>🆔 {booking.bookingId}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className={`text-xs px-3 py-1 rounded-full font-hind ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      {booking.status !== 'cancelled' && booking.status !== 'checked-out' && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="text-xs text-red-600 hover:text-red-800 font-hind underline"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
