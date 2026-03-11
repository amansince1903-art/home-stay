# Haveli Stay - Hotel Booking System

A full-stack hotel booking system built with React, Node.js, Express, and MongoDB.

## 🏨 Features

### Phase 1 (Completed)
- ✅ User Authentication (JWT-based)                         
- ✅ Role-based Access Control (Guest/Admin)                   
- ✅ Real Booking System with Availability Checking           
- ✅ Room Inventory Management                                
- ✅ Booking Status Tracking                              
- ✅ Admin Dashboard
- ✅ User Dashboard
- ✅ Email Notifications (configured)                             
- ✅ Date Range Picker Calendar                             
- ✅ Complete Validation System                               

### Frontend
- React 18 with Vite
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- React Date Range for calendar
- Axios for API calls
- React Toastify for notifications

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Nodemailer for emails
- CORS enabled

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   └── assets/        # Images and static files
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── utils/            # Utility functions
│   ├── scripts/          # Database seed scripts
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd hotel-booking-system
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../client
npm install
```

4. **Configure Environment Variables**

Create `.env` file in `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-booking
JWT_SECRET=your-secret-key-change-in-production

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

5. **Seed Database**
```bash
cd server
npm run seed
```

This creates:
- Admin user: admin@havelistay.in / admin123
- 3 rooms with inventory

6. **Start Backend Server**
```bash
cd server
npm run dev
```
Server runs on: http://localhost:5000

7. **Start Frontend**
```bash
cd client
npm run dev
```
Frontend runs on: http://localhost:5173

## 🔑 Default Login Credentials

**Admin Account:**
- Email: admin@havelistay.in
- Password: admin123

**Guest Account:**
- Register at /register to create a new account

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/my-bookings` - Get user bookings (protected)
- `GET /api/bookings/all` - Get all bookings (admin only)
- `PUT /api/bookings/:id/status` - Update status (admin only)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)

### Rooms
- `GET /api/rooms` - Get all active rooms
- `GET /api/rooms/:id` - Get single room
- `POST /api/rooms/check-availability` - Check availability
- `POST /api/rooms` - Create room (admin only)
- `PUT /api/rooms/:id` - Update room (admin only)

### Contacts & Inquiries
- `POST /api/contacts` - Submit contact form
- `POST /api/inquiries` - Submit inquiry form

## 🎨 Features in Detail

### User Features
- Browse available rooms
- Real-time availability checking
- Create bookings with date validation
- View booking history
- Cancel bookings
- Receive email confirmations

### Admin Features
- View all bookings
- Update booking status
- Manage room inventory
- View revenue statistics
- Filter bookings by status

### Validation System
- ✅ Check-in ≥ Today
- ✅ Check-out > Check-in
- ✅ Real-time availability check
- ✅ Inventory management
- ✅ Guest capacity validation
- ✅ Frontend + Backend validation

## 🛠️ Development Commands

### Backend
```bash
cd server
npm run dev      # Start with auto-reload
npm run seed     # Seed database
npm start        # Production start
```

### Frontend
```bash
cd client
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📦 Database Management

### Re-seed Database
```bash
cd server
npm run seed
```

### Backup Database
```bash
mongodump --db hotel-booking --out ./backup
```

### Restore Database
```bash
mongorestore --db hotel-booking ./backup/hotel-booking
```

## 🐛 Troubleshooting

### "No rooms available"
Run: `cd server && npm run seed`

### Port already in use
```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
killall node
```

### MongoDB connection error
- Check MongoDB is running
- Verify MONGODB_URI in .env

## 📖 Documentation

Check these files for detailed information:
- `client/PHASE1_COMPLETE.md` - Phase 1 features
- `client/VALIDATION_COMPLETE.md` - Validation system
- `client/NAVBAR_AND_CALENDAR_CHANGES.md` - UI changes
- `server/DATABASE_MANAGEMENT.md` - Database guide

## 🚧 Roadmap (Phase 2)

- [ ] Payment gateway integration (Razorpay)
- [ ] Invoice generation
- [ ] Booking modification
- [ ] Advanced search filters
- [ ] Reviews and ratings system
- [ ] Multi-language support
- [ ] SMS notifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- aman singh - Initial work

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the database
- All contributors and testers

## 📞 Support

For support, email info@havelistay.in or create an issue in the repository.

---

Built with ❤️ for Haveli Stay - Uttar Pradesh Heritage

# home-stay
