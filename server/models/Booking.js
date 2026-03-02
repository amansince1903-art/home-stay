import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional for guest bookings
  // Guest information (for non-registered users)
  guestName: { type: String },
  guestEmail: { type: String },
  guestPhone: { type: String },
  isGuestBooking: { type: Boolean, default: false },
  
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  numberOfRooms: { type: Number, default: 1 }, // Number of rooms booked
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'], 
    default: 'pending' 
  },
  specialRequests: { type: String },
  bookingId: { type: String, unique: true },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  createdAt: { type: Date, default: Date.now }
});

bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);
