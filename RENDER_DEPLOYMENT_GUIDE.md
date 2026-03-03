# 🚀 DAISY DALE - Render.com Deployment Guide

## Overview
This guide will help you deploy your full-stack DAISY DALE booking website to Render.com. We'll deploy:
1. **Backend (Node.js API)** - Express server
2. **Frontend (React App)** - Vite build
3. **Database (MongoDB)** - MongoDB Atlas (free tier)

---

## 📋 Prerequisites

Before starting, you need:
- ✅ GitHub account (to push your code)
- ✅ Render.com account (free - sign up at render.com)
- ✅ MongoDB Atlas account (free - sign up at mongodb.com/cloud/atlas)

---

## 🗂️ Step 1: Prepare Your Project

### 1.1 Create render.yaml (Blueprint Configuration)

This file tells Render how to deploy your app. Create it in your project root:

**What it does:** Defines all services (backend, frontend, database) in one file
**Why:** Automates deployment - Render reads this and sets everything up

```yaml
services:
  # Backend API Service
  - type: web
    name: daisy-dale-api
    env: node
    region: oregon
    plan: free
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGODB_URI
        sync: false  # You'll add this manually in Render dashboard
      - key: JWT_SECRET
        generateValue: true  # Render auto-generates secure secret
      - key: EMAIL_HOST
        value: smtp.gmail.com
      - key: EMAIL_PORT
        value: 587
      - key: EMAIL_USER
        sync: false  # Add manually
      - key: EMAIL_PASS
        sync: false  # Add manually
    healthCheckPath: /api/rooms

  # Frontend Static Site
  - type: web
    name: daisy-dale-frontend
    env: static
    region: oregon
    plan: free
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: ./client/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    envVars:
      - key: VITE_API_URL
        fromService:
          type: web
          name: daisy-dale-api
          envVarKey: RENDER_EXTERNAL_URL
```

---

## 🔧 Step 2: Update Your Code for Production

### 2.1 Update Frontend API Calls

**Why:** In production, frontend needs to call the deployed backend URL, not localhost

Create `client/.env.production`:
```env
VITE_API_URL=https://daisy-dale-api.onrender.com
```

Update `client/src/main.jsx` or create `client/src/config.js`:
```javascript
// client/src/config.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

Then update axios calls to use this:
```javascript
// Instead of: axios.get('/api/rooms')
// Use: axios.get(`${API_URL}/api/rooms`)
```

### 2.2 Update Backend CORS

**Why:** Allow frontend domain to access backend API

Update `server/server.js`:
```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://daisy-dale-frontend.onrender.com', // Your Render frontend URL
  'https://daisydale.in' // Your custom domain (if any)
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 2.3 Add Build Script to Root

**Why:** Render needs to know how to build your entire project

Create `package.json` in project root:
```json
{
  "name": "daisy-dale",
  "version": "1.0.0",
  "scripts": {
    "install-server": "cd server && npm install",
    "install-client": "cd client && npm install",
    "build-client": "cd client && npm run build",
    "start": "cd server && npm start"
  }
}
```

---

## 🗄️ Step 3: Setup MongoDB Atlas (Database)

### 3.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a new cluster (choose FREE tier - M0)
4. Select region closest to you

### 3.2 Setup Database Access
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `daisydale_admin`
5. Password: Generate strong password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 3.3 Setup Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Why:** Render servers have dynamic IPs
4. Click "Confirm"

### 3.4 Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string:
   ```
   mongodb+srv://daisydale_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `mongodb+srv://daisydale_admin:yourpassword@cluster0.xxxxx.mongodb.net/daisy-dale?retryWrites=true&w=majority`

---

## 🚀 Step 4: Deploy to Render

### 4.1 Push Code to GitHub
```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Render deployment"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/daisy-dale.git
git branch -M main
git push -u origin main
```

### 4.2 Connect Render to GitHub
1. Go to https://render.com
2. Sign up / Log in
3. Click "New +" → "Blueprint"
4. Connect your GitHub account
5. Select your repository: `daisy-dale`
6. Render will detect `render.yaml`

### 4.3 Configure Environment Variables
Render will ask for the variables marked as `sync: false`:

**For Backend (daisy-dale-api):**
- `MONGODB_URI`: Paste your MongoDB Atlas connection string
- `EMAIL_USER`: devteamnyc.dl@gmail.com
- `EMAIL_PASS`: fpzandwvbjsexyvz

Click "Apply" to start deployment!

---

## ⏱️ Step 5: Wait for Deployment

**What happens:**
1. Render clones your GitHub repo
2. Installs dependencies (npm install)
3. Builds frontend (npm run build)
4. Starts backend server
5. Deploys static frontend

**Time:** 5-10 minutes for first deployment

**You'll see:**
- ✅ Backend: `https://daisy-dale-api.onrender.com`
- ✅ Frontend: `https://daisy-dale-frontend.onrender.com`

---

## 🧪 Step 6: Test Your Deployment

### 6.1 Test Backend API
Visit: `https://daisy-dale-api.onrender.com/api/rooms`
- Should return JSON with rooms data

### 6.2 Test Frontend
Visit: `https://daisy-dale-frontend.onrender.com`
- Should load your DAISY DALE website

### 6.3 Seed Database (First Time Only)
You need to seed your production database with rooms and admin user.

**Option 1: Using Render Shell**
1. Go to Render dashboard
2. Click on "daisy-dale-api" service
3. Click "Shell" tab
4. Run: `npm run seed`

**Option 2: Temporary Seed Endpoint**
Add to `server/server.js`:
```javascript
// TEMPORARY - Remove after first use
app.get('/api/seed-production', async (req, res) => {
  // Import and run seed script
  const seedData = require('./scripts/seedData');
  await seedData();
  res.json({ message: 'Database seeded!' });
});
```
Then visit: `https://daisy-dale-api.onrender.com/api/seed-production`

---

## 🔒 Step 7: Security & Best Practices

### 7.1 Update .gitignore
Make sure these are in `.gitignore`:
```
node_modules/
.env
.env.local
.env.production
dist/
build/
```

### 7.2 Remove Sensitive Data
- Never commit `.env` files
- Use Render's environment variables
- Rotate JWT_SECRET regularly

### 7.3 Enable HTTPS
- Render provides free SSL certificates
- All traffic is automatically HTTPS

---

## 🌐 Step 8: Custom Domain (Optional)

### 8.1 Buy Domain
- Buy `daisydale.in` from any registrar (GoDaddy, Namecheap, etc.)

### 8.2 Add to Render
1. Go to your frontend service in Render
2. Click "Settings" → "Custom Domain"
3. Add: `daisydale.in` and `www.daisydale.in`
4. Render will show DNS records to add

### 8.3 Update DNS
In your domain registrar:
- Add CNAME record: `www` → `daisy-dale-frontend.onrender.com`
- Add A record: `@` → Render's IP address

---

## 🔄 Step 9: Continuous Deployment

**What it means:** Every time you push to GitHub, Render auto-deploys

**How it works:**
1. Make changes locally
2. Commit: `git commit -m "Update feature"`
3. Push: `git push origin main`
4. Render automatically detects and deploys!

**To disable auto-deploy:**
- Go to service settings
- Turn off "Auto-Deploy"

---

## 🐛 Troubleshooting

### Issue: "Application failed to respond"
**Solution:** Check backend logs in Render dashboard
- Likely: MongoDB connection issue
- Fix: Verify MONGODB_URI is correct

### Issue: "Cannot connect to API"
**Solution:** Check CORS settings
- Make sure frontend URL is in allowedOrigins

### Issue: "Images not loading"
**Solution:** Images must be in `client/src/assets`
- Vite bundles them during build
- Check `client/dist` folder after build

### Issue: "Free tier sleeps after 15 min"
**Solution:** Render free tier sleeps when inactive
- First request takes 30-60 seconds to wake up
- Upgrade to paid plan ($7/month) for always-on

---

## 💰 Costs

**Free Tier (What you're using):**
- ✅ Backend: Free (sleeps after 15 min inactivity)
- ✅ Frontend: Free (always on)
- ✅ MongoDB Atlas: Free (512MB storage)
- ✅ SSL Certificate: Free
- ✅ Total: $0/month

**Paid Tier (If you upgrade):**
- Backend: $7/month (always on, more resources)
- Frontend: Free (static sites always free)
- MongoDB Atlas: Free tier sufficient
- Total: $7/month

---

## 📝 Quick Reference

### Render Dashboard URLs
- Dashboard: https://dashboard.render.com
- Backend logs: Dashboard → daisy-dale-api → Logs
- Frontend logs: Dashboard → daisy-dale-frontend → Logs

### Your URLs (After Deployment)
- Backend API: `https://daisy-dale-api.onrender.com`
- Frontend: `https://daisy-dale-frontend.onrender.com`
- Admin: `https://daisy-dale-frontend.onrender.com/admin`

### Admin Credentials
- Email: admin@havelistay.in
- Password: admin123
- **⚠️ Change this after first login!**

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] render.yaml created
- [ ] .gitignore updated
- [ ] CORS configured for production URLs

After deploying:
- [ ] Backend API responding
- [ ] Frontend loading
- [ ] Database seeded
- [ ] Test booking flow
- [ ] Test email notifications
- [ ] Test admin dashboard

---

## 🆘 Need Help?

**Render Support:**
- Docs: https://render.com/docs
- Community: https://community.render.com

**MongoDB Atlas Support:**
- Docs: https://docs.atlas.mongodb.com
- Support: https://support.mongodb.com

**Your Project:**
- Check logs in Render dashboard
- Review environment variables
- Test API endpoints individually

---

**Ready to deploy?** Start with Step 1! 🚀

