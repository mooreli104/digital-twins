# Getting Started with FarmTwin

Welcome! This guide will help you start implementing the FarmTwin digital greenhouse dashboard.

## What You Have Now

A complete project skeleton with:

✅ **30 files** across 3 main components (simulator, backend, frontend)
✅ **Clear folder structure** with separation of concerns
✅ **Documented architecture** and data flow
✅ **Implementation checklist** to guide development
✅ **All dependencies defined** in package.json and requirements.txt
✅ **TODO comments** in every file showing what to implement

## The 4 Must-Have Features

1. **Live Dashboard** - Real-time sensor cards + charts
2. **Smart Alerts** - Threshold detection + notifications
3. **Water Savings Counter** - Sustainability metric
4. **Optimal Range Indicators** - Visual health status

## Project File Overview

### Simulator (Python)
```
simulator/
├── sensor_simulator.py    ← Main simulation logic (TODO: implement)
├── config.py              ✅ Tomato ranges defined (ready to use)
└── requirements.txt       ✅ Dependencies listed
```

### Backend (Node.js)
```
backend/
├── server.js              ← WebSocket server (TODO: implement)
├── config/
│   ├── database.js        ← Supabase setup (TODO: add credentials)
│   └── redis.js           ✅ Redis config (ready to use)
├── services/
│   ├── alertService.js    ← Threshold detection (TODO: implement)
│   └── metricsService.js  ← Water savings calculation (TODO: implement)
└── routes/
    └── api.js             ← REST endpoints (TODO: implement)
```

### Frontend (React)
```
frontend/
├── src/
│   ├── pages/
│   │   └── Dashboard.jsx          ← Main layout (TODO: wire up)
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── SensorCard.jsx     ← Sensor display (TODO: implement)
│   │   │   └── SensorChart.jsx    ← Charts (TODO: implement)
│   │   ├── alerts/
│   │   │   ├── AlertPanel.jsx     ← Alert list (TODO: implement)
│   │   │   └── AlertItem.jsx      ✅ Alert card (mostly done)
│   │   └── metrics/
│   │       └── MetricsPanel.jsx   ← Water savings (TODO: implement)
│   ├── hooks/
│   │   └── useWebSocket.js        ← WebSocket hook (TODO: implement)
│   └── services/
│       ├── api.js                 ← HTTP client (TODO: implement)
│       └── supabase.js            ← Auth client (TODO: implement)
└── package.json                   ✅ Dependencies listed
```

## Recommended Implementation Order

### Step 1: Get Data Flowing (2-3 hours)
Start here to establish the core pipeline:

1. **Implement Python simulator** ([simulator/sensor_simulator.py](simulator/sensor_simulator.py))
   - Copy tomato ranges from config.py
   - Generate realistic random data
   - Publish to Redis every 2 seconds
   - Test: `redis-cli SUBSCRIBE greenhouse:sensors`

2. **Connect backend to Redis** ([backend/server.js](backend/server.js))
   - Create Redis subscriber
   - Listen to sensor channel
   - Log data to console
   - Test: Verify backend receives data

3. **Setup WebSocket** ([backend/server.js](backend/server.js))
   - Initialize Socket.io
   - Broadcast sensor data to clients
   - Test: Check browser console for connection

### Step 2: Build Dashboard UI (3-4 hours)

4. **Implement WebSocket hook** ([frontend/src/hooks/useWebSocket.js](frontend/src/hooks/useWebSocket.js))
   - Connect to backend
   - Handle incoming data
   - Update React state

5. **Build SensorCard component** ([frontend/src/components/dashboard/SensorCard.jsx](frontend/src/components/dashboard/SensorCard.jsx))
   - Display value, unit, status
   - Add color coding (green/yellow/red)
   - Show optimal range text

6. **Wire up Dashboard page** ([frontend/src/pages/Dashboard.jsx](frontend/src/pages/Dashboard.jsx))
   - Use WebSocket hook
   - Render 5 SensorCards
   - Test: See live updates!

7. **Add charts** ([frontend/src/components/dashboard/SensorChart.jsx](frontend/src/components/dashboard/SensorChart.jsx))
   - Store last 60 readings
   - Use Recharts LineChart
   - Add optimal range lines

### Step 3: Smart Features (4-5 hours)

8. **Implement alert detection** ([backend/services/alertService.js](backend/services/alertService.js))
   - Check thresholds on each sensor reading
   - Emit alerts via WebSocket
   - Test: Simulate extreme values

9. **Build alert UI** ([frontend/src/components/alerts/AlertPanel.jsx](frontend/src/components/alerts/AlertPanel.jsx))
   - Display active alerts
   - Add toast notifications
   - Test: Verify alerts appear

10. **Calculate water savings** ([backend/services/metricsService.js](backend/services/metricsService.js))
    - Track irrigation events
    - Compare to traditional schedule
    - Test: Verify math

11. **Display metrics** ([frontend/src/components/metrics/MetricsPanel.jsx](frontend/src/components/metrics/MetricsPanel.jsx))
    - Show gallons saved
    - Add comparison text
    - Test: Verify display

### Step 4: Persistence & Polish (3-4 hours)

12. **Setup Supabase**
    - Run DATABASE_SCHEMA.md SQL
    - Get API credentials
    - Add to .env files

13. **Persist data** ([backend/services/metricsService.js](backend/services/metricsService.js))
    - Batch save sensor history every 5 min
    - Save alerts to Supabase
    - Test: Check Supabase dashboard

14. **Polish UI**
    - Add loading states
    - Improve styling
    - Test on mobile

## Key Files to Start With

If you only have time to implement a few files, prioritize these:

1. **[simulator/sensor_simulator.py](simulator/sensor_simulator.py)** - Get data flowing
2. **[backend/server.js](backend/server.js)** - WebSocket server
3. **[frontend/src/hooks/useWebSocket.js](frontend/src/hooks/useWebSocket.js)** - Connect frontend
4. **[frontend/src/components/dashboard/SensorCard.jsx](frontend/src/components/dashboard/SensorCard.jsx)** - Display data
5. **[backend/services/alertService.js](backend/services/alertService.js)** - Smart alerts

These 5 files will give you a working live dashboard with alerts.

## First Commands to Run

```bash
# 1. Install Python dependencies
cd simulator
pip install redis python-dotenv

# 2. Install backend dependencies
cd ../backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Start Redis (in a new terminal)
redis-server

# You're ready to start coding!
```

## Testing Your Progress

After implementing each component, test it:

- **Simulator**: `redis-cli SUBSCRIBE greenhouse:sensors` should show data
- **Backend**: Console should log incoming sensor readings
- **Frontend**: Browser should show live updating values
- **Alerts**: Manually set soil to 30% in simulator, verify alert appears
- **Metrics**: Check water savings increments when irrigation occurs

## Documentation Quick Links

- **[README.md](README.md)** - Project overview
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed installation
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Architecture details
- **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** - Supabase SQL
- **[IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)** - Step-by-step tasks

## Tips for Success

1. **Start simple**: Get one sensor displaying before adding all five
2. **Test incrementally**: Don't wait until everything is built
3. **Use console.log**: Debug data flow at each step
4. **Check browser console**: React errors show up here
5. **Keep Redis running**: Many bugs are just "forgot to start Redis"
6. **Commit often**: Save your progress as you go

## When You Get Stuck

1. Check the TODO comments in each file for guidance
2. Review PROJECT_STRUCTURE.md for data flow
3. Look at IMPLEMENTATION_CHECKLIST.md for common pitfalls
4. Test each component in isolation
5. Verify environment variables are set correctly

## What Success Looks Like

After 12-16 hours of implementation, you should have:

✅ Python simulator generating realistic data
✅ Node backend broadcasting via WebSocket
✅ React dashboard with 5 live sensor cards
✅ Real-time charts showing trends
✅ Alerts firing when thresholds are crossed
✅ Water savings counter updating
✅ Clean, responsive UI

## Ready to Start?

1. Read [SETUP_GUIDE.md](SETUP_GUIDE.md) to set up your environment
2. Open [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) to track progress
3. Start with [simulator/sensor_simulator.py](simulator/sensor_simulator.py)
4. Follow the recommended implementation order above

---

**You've got this! Build features, ship early, iterate fast.**
