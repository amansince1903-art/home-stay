import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
     const { data } = await axios.get('/api/bookings');
      setBookings(data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}/status`, { status });
      toast.success('Status updated');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update status');
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

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => (b.status || '').toLowerCase() === filter.toLowerCase());

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    revenue: bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalPrice, 0)
  };

  return (
    <div className="min-h-screen bg-ivory py-20 px-6 md:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-ink mb-2">Admin Dashboard</h1>
          <p className="text-mud font-hind">Manage all bookings and reservations</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-parchment">
            <div className="text-saffron text-3xl mb-2">📊</div>
            <div className="font-serif text-2xl">{stats.total}</div>
            <div className="text-mud text-xs font-hind">Total Bookings</div>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm border border-parchment">
            <div className="text-yellow-500 text-3xl mb-2">⏳</div>
            <div className="font-serif text-2xl">{stats.pending}</div>
            <div className="text-mud text-xs font-hind">Pending Approval</div>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm border border-parchment">
            <div className="text-green-500 text-3xl mb-2">✓</div>
            <div className="font-serif text-2xl">{stats.confirmed}</div>
            <div className="text-mud text-xs font-hind">Confirmed</div>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm border border-parchment">
            <div className="text-saffron text-3xl mb-2">💰</div>
            <div className="font-serif text-2xl">₹{stats.revenue.toLocaleString()}</div>
            <div className="text-mud text-xs font-hind">Total Revenue</div>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-parchment p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <h2 className="font-serif text-2xl">All Bookings</h2>
            <div className="flex gap-2">
              {['all', 'pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`text-xs px-3 py-1.5 rounded-sm font-hind transition-colors ${
                    filter === status 
                      ? 'bg-saffron text-white' 
                      : 'bg-parchment text-mud hover:bg-saffron hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-center text-mud font-hind py-8">Loading...</p>
          ) : filteredBookings.length === 0 ? (
            <p className="text-center text-mud font-hind py-8">No bookings found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-parchment">
                  <tr>
                    <th className="text-left p-3 font-hind text-xs tracking-wider">Booking ID</th>
                    <th className="text-left p-3 font-hind text-xs tracking-wider">Guest</th>
                    <th className="text-left p-3 font-hind text-xs tracking-wider">Room</th>
                    <th className="text-left p-3 font-hind text-xs tracking-wider">Rooms</th>
                    <th className="text-left p-3 font-hind text-xs tracking-wider">Dates</th>
                    <th className="text-left p-3 font-hind text-xs tracking-wider">Guests</th>
                    <th className="text-left p-3 font-hind text-xs tracking-wider">Price</th>
                    <th className="text-left p-3 font-hind text-xs tracking-wider">Status</th>
                    <th className="text-left p-3 font-hind text-xs tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking._id} className="border-b border-parchment hover:bg-parchment/30">
                      <td className="p-3 font-hind">{booking.bookingId}</td>
                      <td className="p-3">
                        <div className="font-hind">
                          <div className="font-semibold">{booking.isGuestBooking ? booking.guestName : booking.user?.name}</div>
                          <div className="text-xs text-mud">{booking.isGuestBooking ? booking.guestEmail : booking.user?.email}</div>
                          {booking.isGuestBooking && <div className="text-xs text-amber-600">👤 Guest Booking</div>}
                        </div>
                      </td>
                      <td className="p-3 font-hind">{booking.room?.name}</td>
                      <td className="p-3 font-hind font-semibold">{booking.numberOfRooms || 1}</td>
                      <td className="p-3 font-hind text-xs">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-hind">{booking.guests}</td>
                      <td className="p-3 font-hind">₹{booking.totalPrice.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-hind ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={booking.status}
                          onChange={(e) => updateStatus(booking._id, e.target.value)}
                          className="text-xs border border-parchment rounded-sm px-2 py-1 font-hind"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="checked-in">Checked-in</option>
                          <option value="checked-out">Checked-out</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
