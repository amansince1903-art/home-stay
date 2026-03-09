import express from 'express';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'active' });
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Real availability check — counts numberOfRooms from each booking
router.get('/availability', async (req, res) => {
  try {
    const { checkIn, checkOut, numberOfRooms } = req.query
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    const allRooms = await Room.find({ status: 'active' })

    let totalAvailable = 0

    for (const room of allRooms) {
      // Get all overlapping bookings for this room
      const overlappingBookings = await Booking.find({
        room: room._id,
        status: { $in: ['pending', 'confirmed', 'checked-in'] },
        checkIn: { $lt: checkOutDate },
        checkOut: { $gt: checkInDate }
      })

      // Sum numberOfRooms from all overlapping bookings
      const bookedRooms = overlappingBookings.reduce((sum, b) => sum + (b.numberOfRooms || 1), 0)

      // How many rooms are still free
      const freeRooms = room.inventory - bookedRooms
      if (freeRooms > 0) totalAvailable += freeRooms
    }

    res.json({
      available: totalAvailable >= parseInt(numberOfRooms),
      availableRooms: totalAvailable,
      totalRooms: allRooms.reduce((sum, r) => sum + r.inventory, 0)
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
});

router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/check-availability', async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

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

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const overlappingBookings = await Booking.find({
      room: roomId,
      status: { $in: ['pending', 'confirmed', 'checked-in'] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate }
    });

    const bookedRooms = overlappingBookings.reduce((sum, b) => sum + (b.numberOfRooms || 1), 0)
    const available = room.inventory - bookedRooms;

    res.json({
      success: true,
      data: {
        available: available > 0,
        availableCount: Math.max(0, available),
        totalInventory: room.inventory,
        bookedCount: bookedRooms
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;