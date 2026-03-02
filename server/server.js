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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
