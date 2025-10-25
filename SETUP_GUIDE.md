# FarmTwin Setup Guide

Quick start guide for getting the project running.

## Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **Redis** (local or hosted)
- **Supabase account** (free tier)

---

## 1. Redis Setup

### Option A: Local Redis (Windows)
```bash
# Download Redis for Windows from:
# https://github.com/microsoftarchive/redis/releases

# Or use WSL:
sudo apt-get install redis-server
redis-server
```

### Option B: Cloud Redis (Easier)
1. Sign up at [Railway.app](https://railway.app) or [Redis Cloud](https://redis.com/try-free/)
2. Get your connection URL
3. Update `.env` files with your Redis URL

---

## 2. Supabase Setup

1. **Create a new project** at [supabase.com](https://supabase.com)

2. **Run the database schema**:
   - Go to SQL Editor in Supabase dashboard
   - Copy contents from `DATABASE_SCHEMA.md`
   - Execute the SQL

3. **Get your credentials**:
   - Go to Settings → API
   - Copy `Project URL` and `anon public key`

---

## 3. Python Simulator Setup

```bash
cd simulator

# Install dependencies
pip install -r requirements.txt

# Create .env file (optional, uses defaults)
cp .env.example .env

# Run simulator
python sensor_simulator.py
```

**You should see**: `📊 Temp: 75.2°F | Soil: 48.3%` updating every 2 seconds

---

## 4. Node.js Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=your_url_here
# SUPABASE_ANON_KEY=your_key_here

# Run server
npm run dev
```

**You should see**: `Server running on port 3001`

---

## 5. React Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Supabase credentials
# VITE_SUPABASE_URL=your_url_here
# VITE_SUPABASE_ANON_KEY=your_key_here

# Run development server
npm run dev
```

**You should see**: `Local: http://localhost:5173`

---

## 6. Verify Everything Works

1. **Python simulator** is running and printing sensor data
2. **Backend** is connected to Redis (check logs)
3. **Frontend** is running at http://localhost:5173
4. Open the dashboard and you should see live sensor data updating

---

## Troubleshooting

### Python can't connect to Redis
```bash
# Check if Redis is running
redis-cli ping
# Should respond: PONG
```

### Backend can't connect to Supabase
- Double-check your `.env` file has correct credentials
- Verify Supabase project URL format: `https://xxxxx.supabase.co`

### Frontend shows no data
- Check browser console for errors
- Verify backend is running on port 3001
- Check CORS settings in `backend/server.js`

### No sensor data appearing
- Verify Python simulator is running
- Check Redis is receiving data: `redis-cli SUBSCRIBE greenhouse:sensors`
- Verify backend is subscribing to Redis channel

---

## Quick Start (All-in-One)

Run each in a separate terminal:

```bash
# Terminal 1: Redis
redis-server

# Terminal 2: Python Simulator
cd simulator && python sensor_simulator.py

# Terminal 3: Backend
cd backend && npm run dev

# Terminal 4: Frontend
cd frontend && npm run dev
```

---

## Next Steps

1. ✅ Implement sensor simulation logic
2. ✅ Connect backend to Redis pub/sub
3. ✅ Wire up WebSocket to frontend
4. ✅ Add alert detection
5. ✅ Implement water savings calculation
6. ✅ Polish UI and add charts

---

## Deployment (Optional)

- **Frontend**: Deploy to Vercel or Netlify
- **Backend**: Deploy to Railway or Render
- **Simulator**: Run on a cloud VM or Railway
