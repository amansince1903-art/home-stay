# Production Database Seeding Guide

## Overview
This guide explains how to seed your production database on Render.com after deployment.

## What is the Seed Endpoint?
The seed endpoint (`/api/seed-production`) is a secure API route that creates:
- Admin user account (admin@havelistay.in)
- 6 bedroom listings with details

## Security Features
- Protected by secret key (SEED_SECRET environment variable)
- Checks if data already exists before seeding
- Prevents accidental re-seeding
- Returns detailed success/error messages

---

## How to Use

### Step 1: Deploy Your App to Render
Follow the instructions in `RENDER_DEPLOYMENT_GUIDE.md` to deploy your app.

### Step 2: Add SEED_SECRET to Render Environment Variables
1. Go to your Render dashboard
2. Click on your web service
3. Go to "Environment" tab
4. Add new environment variable:
   - Key: `SEED_SECRET`
   - Value: `daisy-dale-seed-2024` (or your custom secret)
5. Click "Save Changes"

### Step 3: Call the Seed Endpoint

#### Option A: Using Postman or Thunder Client
1. Create a new POST request
2. URL: `https://your-app-name.onrender.com/api/seed-production`
3. Body (JSON):
```json
{
  "secretKey": "daisy-dale-seed-2024"
}
```
4. Send the request

#### Option B: Using cURL (Command Line)
```bash
curl -X POST https://your-app-name.onrender.com/api/seed-production \
  -H "Content-Type: application/json" \
  -d '{"secretKey": "daisy-dale-seed-2024"}'
```

#### Option C: Using Browser Console (Quick Test)
1. Open your deployed website
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Paste and run:
```javascript
fetch('https://your-app-name.onrender.com/api/seed-production', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ secretKey: 'daisy-dale-seed-2024' })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Expected Responses

### Success Response
```json
{
  "success": true,
  "message": "Database seeded successfully!",
  "data": {
    "admin": {
      "email": "admin@havelistay.in",
      "name": "Admin",
      "role": "admin"
    },
    "roomsCreated": 6,
    "loginCredentials": {
      "email": "admin@havelistay.in",
      "password": "admin123"
    }
  }
}
```

### Already Seeded Response
```json
{
  "success": false,
  "message": "Database already seeded. Admin and rooms exist.",
  "data": {
    "adminExists": true,
    "roomCount": 6
  }
}
```

### Invalid Secret Key Response
```json
{
  "success": false,
  "message": "Unauthorized: Invalid secret key"
}
```

---

## What Gets Created?

### Admin Account
- Email: `admin@havelistay.in`
- Password: `admin123`
- Phone: `+91 91295 86522`
- Role: `admin`

### 6 Bedrooms
1. Bedroom 1 - ₹2,500/night (2 guests, 2 available)
2. Bedroom 2 - ₹1,800/night (2 guests, 2 available)
3. Bedroom 3 - ₹4,200/night (6 guests, 1 available)
4. Bedroom 4 - ₹3,500/night (3 guests, 1 available)
5. Bedroom 5 - ₹2,200/night (2 guests, 3 available)
6. Bedroom 6 - ₹5,000/night (4 guests, 1 available)

All rooms include DAISY DALE mountain-themed descriptions and amenities.

---

## Important Notes

### ⚠️ Security Warning
- Never commit the SEED_SECRET to GitHub
- Change the default secret key in production
- Only run this endpoint once after deployment
- Consider removing/disabling this endpoint after initial seeding

### 🔄 Re-seeding
If you need to re-seed (clear and recreate data):
- The endpoint will delete existing users and rooms
- All bookings will remain intact
- Use with caution in production!

### 🧪 Testing Locally
You can test the endpoint locally before deploying:
```bash
# Start your local server
cd server
npm start

# In another terminal, call the endpoint
curl -X POST http://localhost:5000/api/seed-production \
  -H "Content-Type: application/json" \
  -d '{"secretKey": "daisy-dale-seed-2024"}'
```

---

## Troubleshooting

### "Unauthorized: Invalid secret key"
- Check that SEED_SECRET is set in Render environment variables
- Verify the secret key matches exactly (case-sensitive)
- Make sure you saved changes in Render dashboard

### "Database already seeded"
- This is normal if you've already run the seed
- Your data is already there, no action needed
- To re-seed, you'll need to manually clear the database first

### "Error seeding database"
- Check MongoDB connection in Render logs
- Verify MONGODB_URI is set correctly
- Check server logs for detailed error message

---

## After Seeding

1. Test admin login at: `https://your-app-name.onrender.com/login`
   - Email: admin@havelistay.in
   - Password: admin123

2. Verify rooms are visible at: `https://your-app-name.onrender.com/rooms`

3. Test booking flow as a guest user

4. Check admin dashboard for booking management

---

## Next Steps

After successful seeding:
1. ✅ Change admin password from dashboard
2. ✅ Test all booking flows
3. ✅ Verify email notifications work
4. ✅ Update room prices/descriptions if needed
5. ✅ Consider disabling the seed endpoint for security

---

Need help? Check the main deployment guide: `RENDER_DEPLOYMENT_GUIDE.md`
