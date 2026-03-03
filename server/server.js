import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

// Debug: Check if email credentials are loaded
console.log('🔍 Environment Check:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Loaded' : '❌ Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Loaded' : '❌ Missing');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'smtp.gmail.com');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT || '587');

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import roomRoutes from './routes/rooms.js';
import contactRoutes from './routes/contacts.js';
import inquiryRoutes from './routes/inquiries.js';
import User from './models/User.js';
import Room from './models/Room.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Production Seed Endpoint (Protected)
app.post('/api/seed-production', async (req, res) => {
  try {
    // Security: Check for secret key
    const { secretKey } = req.body;
    const SEED_SECRET = process.env.SEED_SECRET || 'daisy-dale-seed-2024';
    
    if (secretKey !== SEED_SECRET) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: Invalid secret key' 
      });
    }

    // Check if data already exists
    const existingAdmin = await User.findOne({ email: 'admin@havelistay.in' });
    const existingRooms = await Room.countDocuments();

    if (existingAdmin && existingRooms > 0) {
      return res.status(400).json({
        success: false,
        message: 'Database already seeded. Admin and rooms exist.',
        data: {
          adminExists: true,
          roomCount: existingRooms
        }
      });
    }

    // Clear existing data (optional - be careful in production!)
    await User.deleteMany({});
    await Room.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@havelistay.in',
      password: 'admin123',
      phone: '+919129586522',
      role: 'admin'
    });

    // Create rooms
    const rooms = await Room.insertMany([
      {
        name: 'Bedroom 1',
        slug: 'bedroom-1',
        price: 2500,
        capacity: 2,
        inventory: 2,
        description: 'Cozy mountain room with valley views, wooden interiors & peaceful ambience.',
        amenities: ['King Bed', 'AC + Heater', 'Free WiFi', 'Valley View', 'Breakfast Included', 'Private Bath'],
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
        status: 'active'
      },
      {
        name: 'Bedroom 2',
        slug: 'bedroom-2',
        price: 1800,
        capacity: 2,
        inventory: 2,
        description: 'Wooden balcony with mountain views, antique furniture & serene ambience.',
        amenities: ['Double Bed', 'AC', 'Free WiFi', 'Mountain View', 'Breakfast Included', 'Balcony'],
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        status: 'active'
      },
      {
        name: 'Bedroom 3',
        slug: 'bedroom-3',
        price: 4200,
        capacity: 6,
        inventory: 1,
        description: '3-bedroom cottage with private kitchen, garden & authentic home cooking.',
        amenities: ['3 Bedrooms', 'Private Kitchen', 'Garden', 'AC in all rooms', 'All Meals Included', 'Free WiFi'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
        status: 'active'
      },
      {
        name: 'Bedroom 4',
        slug: 'bedroom-4',
        price: 3500,
        capacity: 3,
        inventory: 1,
        description: 'Luxurious suite with mountain decor, comfortable furniture, and panoramic views.',
        amenities: ['King Bed', 'Sofa Bed', 'AC + Heater', 'Free WiFi', 'Mountain View', 'Breakfast & Dinner', 'Jacuzzi'],
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
        status: 'active'
      },
      {
        name: 'Bedroom 5',
        slug: 'bedroom-5',
        price: 2200,
        capacity: 2,
        inventory: 3,
        description: 'Elegant room with large windows, wooden furniture & modern amenities.',
        amenities: ['Queen Bed', 'AC', 'Free WiFi', 'Mountain Decor', 'Breakfast Included', 'Mini Bar'],
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
        status: 'active'
      },
      {
        name: 'Bedroom 6',
        slug: 'bedroom-6',
        price: 5000,
        capacity: 4,
        inventory: 1,
        description: 'Private cottage with lush garden, outdoor seating, and complete privacy for families.',
        amenities: ['2 Bedrooms', 'Private Garden', 'Kitchen', 'AC in all rooms', 'All Meals', 'Free WiFi', 'BBQ Area'],
        image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80',
        status: 'active'
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        admin: {
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
        roomsCreated: rooms.length,
        loginCredentials: {
          email: 'admin@havelistay.in',
          password: 'admin123'
        }
      }
    });

  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
