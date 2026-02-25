# Hotel Backend API

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update MongoDB URI in `.env` if needed

4. Start server:
```bash
npm run dev
```

## API Endpoints

- POST `/api/bookings` - Create booking
- GET `/api/bookings` - Get all bookings
- POST `/api/contacts` - Create contact message
- GET `/api/contacts` - Get all contacts
