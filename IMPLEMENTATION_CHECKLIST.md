# FarmTwin Implementation Checklist

Use this checklist to track progress during the hackathon.

## Phase 1: Core Data Flow (Hours 0-6)

### Python Simulator
- [ ] Implement `simulate_sensors()` function with realistic data
- [ ] Add day/night cycle logic (temperature, light)
- [ ] Add soil moisture decay over time
- [ ] Implement irrigation trigger when soil < 35%
- [ ] Connect to Redis and publish data
- [ ] Test: Verify data appears in Redis (`redis-cli SUBSCRIBE greenhouse:sensors`)

### Node.js Backend - Basic Setup
- [ ] Install dependencies (`npm install`)
- [ ] Create Redis client and subscriber
- [ ] Subscribe to `greenhouse:sensors` channel
- [ ] Log incoming sensor data to console
- [ ] Test: Verify backend receives data from Python

### React Frontend - Hello World
<!-- - [ ] Install dependencies (`npm install`) -->
<!-- - [ ] Setup Tailwind CSS -->
<!-- - [ ] Create basic layout in Dashboard.jsx
- [ ] Test: Verify app runs at http://localhost:5173 -->

---

## Phase 2: Live Dashboard (Hours 6-12)

### Backend - WebSocket Setup
- [ ] Initialize Socket.io server
- [ ] Handle client connections
- [ ] Emit sensor data to connected clients (`io.emit('sensor-update', data)`)
- [ ] Test: Check WebSocket connection in browser console

### Frontend - WebSocket Integration
- [ ] Implement `useWebSocket` hook
- [ ] Connect to backend WebSocket
- [ ] Update component state on sensor data
- [ ] Test: Console.log incoming data

### Frontend - Sensor Cards
<!-- - [ ] Implement `SensorCard` component -->
<!-- - [ ] Add status color logic (optimal/warning/critical) -->
<!-- - [ ] Create 5 sensor cards in Dashboard -->
<!-- - [ ] Add optimal range text -->
<!-- - [ ] Test: Verify live updates every 2 seconds -->

### Frontend - Charts
- [ ] Install Recharts
- [ ] Implement `SensorChart` component
- [ ] Store last 60 readings in state
- [ ] Create temperature chart
- [ ] Add optimal range reference lines
- [ ] Test: Verify chart updates smoothly

---

## Phase 3: Smart Features (Hours 12-18)

### Backend - Alert System
- [ ] Implement `checkThresholds()` in alertService.js
- [ ] Detect critical conditions (soil < 35%, temp > 90°F)
- [ ] Detect warning conditions (approaching thresholds)
- [ ] Emit alerts via WebSocket
- [ ] Test: Manually trigger alert by simulating extreme values

### Frontend - Alert Display
<!-- - [ ] Implement `AlertItem` component
- [ ] Implement `AlertPanel` component
- [ ] Add toast notifications for new alerts
- [ ] Add alert history list
- [ ] Test: Verify alerts appear when thresholds crossed -->

### Backend - Water Savings Calculation
- [ ] Track irrigation events in Redis
- [ ] Implement `calculateWaterSavings()` in metricsService.js
- [ ] Calculate: traditional (5 gal/day) vs. smart (0.5 gal/event)
- [ ] Add REST endpoint `/api/metrics/water-savings`
- [ ] Test: Verify calculation accuracy

### Frontend - Metrics Panel
<!-- - [ ] Implement `MetricsPanel` component
- [ ] Display water saved today
- [ ] Display water saved this week
- [ ] Add comparison text
- [ ] Test: Verify metrics update correctly -->

### Supabase - Database Setup
<!-- - [ ] Create Supabase project
- [ ] Run SQL schema from DATABASE_SCHEMA.md
- [ ] Get API credentials
- [ ] Add credentials to backend `.env`
- [ ] Add credentials to frontend `.env`
- [ ] Test: Verify connection -->

### Backend - Supabase Integration
- [ ] Initialize Supabase client in backend
- [ ] Implement `saveSensorHistory()` (batch every 5 min)
- [ ] Implement `saveAlert()` to persist alerts
- [ ] Test: Verify data appears in Supabase dashboard

---

## Phase 4: Polish (Hours 18-22)

### UI/UX Improvements
- [ ] Add loading states
- [ ] Add error handling
- [ ] Improve responsive design (mobile)
- [ ] Add connection status indicator
- [ ] Polish color scheme (green theme)
- [ ] Add icons (lucide-react)
- [ ] Test: Check on different screen sizes

### Data Visualization
- [ ] Add multiple charts (humidity, soil moisture)
- [ ] Add chart legends
- [ ] Format timestamps nicely
- [ ] Add smooth animations
- [ ] Test: Verify all charts render correctly

### Optional Features (if time allows)
- [ ] Historical data view (7-day chart)
- [ ] Sustainability score calculation
- [ ] User authentication (Supabase)
- [ ] Alert resolution functionality
- [ ] Export data as CSV
- [ ] Demo mode toggle (speed up time)

---

## Phase 5: Deployment & Demo Prep (Hours 22-24)

### Testing
- [ ] End-to-end test: Simulator → Backend → Frontend
- [ ] Test alert triggers
- [ ] Test water savings calculation
- [ ] Check for console errors
- [ ] Verify WebSocket reconnection

### Demo Preparation
- [ ] Prepare demo script (see below)
- [ ] Test on presentation screen
- [ ] Prepare backup video/screenshots
- [ ] Practice talking points
- [ ] Prepare Q&A answers

### Deployment (Optional)
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy backend to Railway/Render
- [ ] Update CORS settings
- [ ] Test deployed version

---

## Demo Script Template

### Opening (30 seconds)
"What if every urban greenhouse could reduce water waste by 40% without spending thousands on sensors? FarmTwin is a digital twin dashboard that gives small-scale farmers precision agriculture tools—accessible and affordable."

### Live Demo (90 seconds)
1. **Show live dashboard**: "Here's a tomato greenhouse being monitored in real-time. You can see temperature, humidity, soil moisture, light levels, and CO2—all updating every 2 seconds."

2. **Trigger alert**: "Watch what happens when soil moisture drops below 40%..." [Show alert popup] "An instant alert fires, preventing both under-watering and over-watering."

3. **Show water savings**: "Over this week, this greenhouse saved 47 gallons compared to traditional fixed-schedule watering. Scaled across urban farms, that's millions of gallons annually."

4. **Show charts**: "Historical trends help farmers understand patterns and make better decisions."

### Impact (30 seconds)
"FarmTwin demonstrates how digital twins can democratize precision agriculture—empowering community gardens, schools, and small farms to grow food sustainably. This is a proof of concept that's ready for real sensor integration today."

---

## Common Pitfalls to Avoid

- [ ] **Redis not running**: Start Redis before Python simulator
- [ ] **CORS errors**: Ensure backend allows frontend origin
- [ ] **WebSocket not connecting**: Check port 3001 is correct
- [ ] **Charts not updating**: Verify data structure matches Recharts format
- [ ] **Supabase rate limits**: Batch writes every 5 min, not every 2 sec
- [ ] **Timestamps not formatted**: Use `new Date().toLocaleTimeString()`

---

## Success Metrics

By the end, you should have:

✅ Live sensor data updating every 2 seconds
✅ Visual dashboard with 5 sensor cards
✅ Real-time line charts
✅ Smart alerts for threshold violations
✅ Water savings counter (daily + weekly)
✅ Optimal range indicators
✅ Clean, responsive UI
✅ Demo-ready presentation

---

## Quick Reference Commands

```bash
# Start Redis
redis-server

# Run Python Simulator
cd simulator && python sensor_simulator.py

# Run Backend
cd backend && npm run dev

# Run Frontend
cd frontend && npm run dev

# Check Redis data
redis-cli SUBSCRIBE greenhouse:sensors

# Check Redis keys
redis-cli KEYS *
```

---

**Stay focused. Ship features. Win the hackathon.**
