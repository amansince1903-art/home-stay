import express from 'express';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import { protect, optionalProtect } from '../middleware/auth.js';
import { sendBookingConfirmation } from '../utils/email.js';
import { validatePhone, sanitizePhone } from '../utils/validation.js';

const router = express.Router();

// 🔍 DEBUG: Log all booking requests
router.use((req, res, next) => {
  console.log('\n📋 Booking Route Hit:');
  console.log('   Method:', req.method);
  console.log('   Path:', req.path);
  console.log('   req.user exists?', !!req.user);
  console.log('   Authorization header?', !!req.headers.authorization);
  console.log('   Body:', JSON.stringify(req.body, null, 2));
  next();
});

// Create booking (supports both logged-in users and guests)
router.post('/', optionalProtect, async (req, res) => {
  try {
    const { 
      roomId, 
      checkIn, 
      checkOut, 
      numberOfRooms = 1,
      guests, 
      specialRequests,
      // Guest information (for non-logged-in users)
      guestName,
      guestEmail,
      guestPhone
    } = req.body;

    console.log('\n🔍 Processing Booking:');
    console.log('   User authenticated?', !!req.user);
    console.log('   Guest booking?', !req.user);

    // Determine if this is a guest booking
    const isGuestBooking = !req.user;

    // Validate required fields based on booking type
    if (isGuestBooking) {
      // Guest booking - require guest information
      if (!guestName || !guestEmail || !guestPhone) {
        console.log('❌ Guest booking missing required fields');
        return res.status(400).json({
          message: 'Guest name, email, and phone are required',
          success: false,
        });
      }

      // Validate phone number
      const phoneValidation = validatePhone(guestPhone);
      if (!phoneValidation.valid) {
        return res.status(400).json({
          success: false,
          message: phoneValidation.message
        });
      }
    }

    // Validate common required fields
    if (!roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Room, check-in, check-out dates, and number of guests are required'
      });
    }

    // Fetch room details
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Calculate nights and total price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * numberOfRooms * nights;

    // Create booking object
    const bookingData = {
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numberOfRooms,
      guests,
      totalPrice,
      specialRequests,
      isGuestBooking
    };

    // Add user or guest information
    if (isGuestBooking) {
      bookingData.guestName = guestName;
      bookingData.guestEmail = guestEmail;
      bookingData.guestPhone = sanitizePhone(guestPhone);
      console.log('✅ Guest booking data prepared');
    } else {
      bookingData.user = req.user._id;
      console.log('✅ User booking data prepared for user:', req.user._id);
    }

    // Create booking
    const booking = await Booking.create(bookingData);
    
    // Populate room details for email
    await booking.populate('room');
    
    // Populate user details if logged in
    if (!isGuestBooking) {
      await booking.populate('user');
    }

    console.log('✅ Booking created:', booking.bookingId);

    // Send confirmation email
    try {
      const emailData = {
        bookingId: booking.bookingId,
        guestName: isGuestBooking ? guestName : req.user.name,
        email: isGuestBooking ? guestEmail : req.user.email,
        roomName: room.name,
        checkIn: checkInDate.toLocaleDateString('en-IN'),
        checkOut: checkOutDate.toLocaleDateString('en-IN'),
        guests,
        numberOfRooms,
        nights,
        totalPrice,
        specialRequests
      };

      await sendBookingConfirmation(emailData);
      console.log('✅ Confirmation email sent to:', emailData.email);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    console.error('❌ Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// Get all bookings (admin only)
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room')
      .populate('user', '-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// Get user's own bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your bookings',
      error: error.message
    });
  }
});

// Get single booking
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', '-password');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user && booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// Update booking status (admin only)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('room').populate('user', '-password');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
});

// Cancel booking
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const isOwner = booking.user && booking.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
});

export default router;
