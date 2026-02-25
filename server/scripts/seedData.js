import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Room from '../models/Room.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    await User.deleteMany({});
    await Room.deleteMany({});

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@havelistay.in',
      password: 'admin123',
      phone: '+919876543210',
      role: 'admin'
    });

    const rooms = await Room.insertMany([
      {
        name: 'Royal Haveli Suite',
        slug: 'royal-haveli-suite',
        price: 2500,
        capacity: 2,
        inventory: 2,
        description: 'Grand suite with Mughal arches, hand-painted walls & private courtyard view.',
        amenities: ['King Bed', 'AC + Heater', 'Free WiFi', 'Courtyard View', 'Breakfast Included', 'Private Bath'],
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
        status: 'active'
      },
      {
        name: 'Gangamahal Room',
        slug: 'gangamahal-room',
        price: 1800,
        capacity: 2,
        inventory: 2,
        description: 'Wooden balcony with sacred Ganga views, antique furniture & serene ambience.',
        amenities: ['Double Bed', 'AC', 'Free WiFi', 'Ganga View', 'Breakfast Included', 'Balcony'],
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        status: 'active'
      },
      {
        name: 'Family Kothi',
        slug: 'family-kothi',
        price: 4200,
        capacity: 6,
        inventory: 1,
        description: '3-bedroom kothi with private kitchen, sit-out garden & authentic home cooking.',
        amenities: ['3 Bedrooms', 'Private Kitchen', 'Garden', 'AC in all rooms', 'All Meals Included', 'Free WiFi'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
        status: 'active'
      }
    ]);

    console.log('✅ Admin user created:', admin.email);
    console.log('✅ Rooms created:', rooms.length);
    console.log('\nLogin credentials:');
    console.log('Email: admin@havelistay.in');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
