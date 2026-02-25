import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  inventory: { type: Number, required: true, default: 2 },
  description: { type: String },
  amenities: [{ type: String }],
  image: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Room', roomSchema);
