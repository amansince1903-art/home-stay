# Database Management Guide

## If You See "No rooms available"

This means the rooms collection in MongoDB is empty. Here's how to fix it:

### Quick Fix - Re-seed Database

```bash
cd server
npm run seed
```

This will:
- ✅ Delete all existing users and rooms
- ✅ Create 1 admin user (admin@havelistay.in / admin123)
- ✅ Create 3 rooms:
  - Royal Haveli Suite (₹2,500/night, 2 rooms, capacity: 2 guests)
  - Gangamahal Room (₹1,800/night, 2 rooms, capacity: 2 guests)
  - Family Kothi (₹4,200/night, 1 room, capacity: 6 guests)

### Verify Rooms Are Available

```bash
curl http://localhost:5000/api/rooms
```

Should return JSON with 3 rooms.

---

## Common Scenarios

### Scenario 1: Accidentally Deleted Rooms
**Problem:** Deleted rooms from MongoDB Compass or admin panel

**Solution:**
```bash
cd server
npm run seed
```

### Scenario 2: Database Connection Lost
**Problem:** MongoDB not running or connection string wrong

**Check:**
1. Is MongoDB running? (Check MongoDB Compass or service)
2. Check `.env` file: `MONGODB_URI=mongodb://localhost:27017/hotel-booking`

**Fix:**
- Start MongoDB service
- Or update connection string in `.env`
- Restart server: `npm run dev`

### Scenario 3: Empty Database After Fresh Install
**Problem:** New installation, no data

**Solution:**
```bash
cd server
npm install
npm run seed
npm run dev
```

---

## What the Seed Script Does

### File: `server/scripts/seedData.js`

```javascript
// 1. Connects to MongoDB
await mongoose.connect(process.env.MONGODB_URI);

// 2. Clears existing data
await User.deleteMany({});
await Room.deleteMany({});

// 3. Creates admin user
const admin = await User.create({
  name: 'Admin',
  email: 'admin@havelistay.in',
  password: 'admin123',
  phone: '+919876543210',
  role: 'admin'
});

// 4. Creates 3 rooms
const rooms = await Room.insertMany([...]);
```

---

## Manual Database Management

### Using MongoDB Compass:

1. **Connect to:** `mongodb://localhost:27017`
2. **Database:** `hotel-booking`
3. **Collections:**
   - `users` - User accounts
   - `rooms` - Room inventory
   - `bookings` - All bookings
   - `inquiries` - Contact inquiries
   - `contacts` - Contact form submissions

### View Rooms:
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select database: `hotel-booking`
4. Click collection: `rooms`
5. Should see 3 documents

### Delete All Bookings (for testing):
```javascript
// In MongoDB Compass, run this query in bookings collection:
{}
// Then click "Delete" button
```

### Add More Room Inventory:
```javascript
// In MongoDB Compass, edit a room document:
{
  "inventory": 5  // Change from 2 to 5
}
```

---

## Backup & Restore

### Backup Database:
```bash
mongodump --db hotel-booking --out ./backup
```

### Restore Database:
```bash
mongorestore --db hotel-booking ./backup/hotel-booking
```

---

## Troubleshooting

### "No rooms available" on booking page
**Cause:** Rooms collection is empty

**Fix:**
```bash
cd server
npm run seed
```

### "Failed to load rooms" error
**Cause:** Backend not running or MongoDB not connected

**Fix:**
1. Check backend is running: `http://localhost:5000/api/rooms`
2. Check MongoDB is running
3. Restart backend: `npm run dev`

### Rooms show but can't book
**Cause:** User not logged in or authentication issue

**Fix:**
1. Login at `/login`
2. Or register at `/register`
3. Then try booking again

### All rooms show "Not available"
**Cause:** All inventory is booked for those dates

**Fix:**
1. Try different dates
2. Or delete test bookings from MongoDB
3. Or increase room inventory in database

---

## Quick Commands Reference

```bash
# Re-seed database (fresh start)
cd server
npm run seed

# Start backend server
npm run dev

# Check if rooms exist
curl http://localhost:5000/api/rooms

# Check if backend is running
curl http://localhost:5000/api/rooms

# Kill all node processes (if port in use)
taskkill /F /IM node.exe

# Restart everything
taskkill /F /IM node.exe
cd server
npm run seed
npm run dev
```

---

## Current Database State

After running `npm run seed`, you have:

### Users:
- **Admin:** admin@havelistay.in / admin123

### Rooms:
1. **Royal Haveli Suite**
   - Price: ₹2,500/night
   - Inventory: 2 rooms
   - Capacity: 2 guests

2. **Gangamahal Room**
   - Price: ₹1,800/night
   - Inventory: 2 rooms
   - Capacity: 2 guests

3. **Family Kothi**
   - Price: ₹4,200/night
   - Inventory: 1 room
   - Capacity: 6 guests

### Bookings:
- Empty (no test bookings)

---

## Remember

- Run `npm run seed` whenever you need fresh data
- This will DELETE all existing users and rooms
- Existing bookings will remain (seed script doesn't touch bookings)
- Admin password is always reset to `admin123`

---

## Need Help?

If rooms still don't show after seeding:
1. Check browser console for errors (F12)
2. Check backend terminal for errors
3. Verify MongoDB is running
4. Try refreshing the page (Ctrl+R)
5. Clear browser cache and reload
