import express from 'express';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import { protect, admin } from '../middleware/auth.js';
import { sendBookingConfirmation } from '../utils/email.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, numberOfRooms = 1, specialRequests, guestName, guestEmail, guestPhone } = req.body;

    // Check if it's a guest booking or authenticated user
    const isGuestBooking = !req.user;
    
    // Validate guest information if not logged in
    if (isGuestBooking) {
      if (!guestName || !guestEmail || !guestPhone) {
        return res.status(400).json({ success: false, message: 'Guest name, email, and phone are required' });
      }
    }

    // Validate dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate < today) {
      return res.status(400).json({ success: false, message: 'Check-in date must be today or later' });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
    }

    // Validate room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Validate guest capacity — adults only, multiplied by number of rooms
    const maxGuests = room.capacity * numberOfRooms;
    if (guests > maxGuests) {
      return res.status(400).json({ 
        success: false, 
        message: `${numberOfRooms} room(s) can accommodate maximum ${maxGuests} adults. You selected ${guests}.` 
      });
    }

    // Check availability - count overlapping bookings
    const overlappingBookings = await Booking.countDocuments({
      room: roomId,
      status: { $in: ['pending', 'confirmed', 'checked-in'] },
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
      ]
    });

    // Check inventory
    if (overlappingBookings >= room.inventory) {
      return res.status(400).json({ 
        success: false, 
        message: `Room not available for selected dates. All ${room.inventory} rooms are booked.` 
      });
    }

    // Calculate price
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (nights < 1) {
      return res.status(400).json({ success: false, message: 'Booking must be at least 1 night' });
    }
    const totalPrice = room.price * nights * numberOfRooms;

    // Create booking
    const bookingData = {
      room: roomId,
      numberOfRooms: numberOfRooms || 1,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      specialRequests
    };

    // Add user or guest information
    if (isGuestBooking) {
      bookingData.isGuestBooking = true;
      bookingData.guestName = guestName;
      bookingData.guestEmail = guestEmail;
      bookingData.guestPhone = guestPhone;
    } else {
      bookingData.user = req.user._id;
      bookingData.isGuestBooking = false;
    }

    const booking = await Booking.create(bookingData);

    // Populate booking details for email
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('room', 'name price');

    // Send confirmation email
    await sendBookingConfirmation(populatedBooking);

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room', 'name price image')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/all', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('room', 'name price')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('room', 'name price image amenities');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    .populate('user', 'name email')
    .populate('room', 'name');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Send email notification when status changes to confirmed
    if (status === 'confirmed') {
      await sendBookingConfirmation(booking);
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;