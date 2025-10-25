# FarmTwin Project Structure

```
digital-twins/
├── simulator/                  # Python sensor data generator
│   ├── sensor_simulator.py     # Main simulation logic
│   ├── config.py               # Tomato ranges & Redis config
│   └── requirements.txt        # Python dependencies
│
├── backend/                    # Node.js WebSocket + API server
│   ├── server.js               # Main entry point
│   ├── config/
│   │   ├── database.js         # Supabase client setup
│   │   └── redis.js            # Redis client setup
│   ├── services/
│   │   ├── alertService.js     # Threshold detection logic
│   │   └── metricsService.js   # Water savings calculations
│   ├── routes/
│   │   └── api.js              # REST API endpoints
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # React dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── SensorCard.jsx       # Individual sensor display
│   │   │   │   └── SensorChart.jsx      # Real-time charts
│   │   │   ├── alerts/
│   │   │   │   ├── AlertPanel.jsx       # Alert list container
│   │   │   │   └── AlertItem.jsx        # Single alert card
│   │   │   └── metrics/
│   │   │       └── MetricsPanel.jsx     # Water savings display
│   │   ├── pages/
│   │   │   └── Dashboard.jsx            # Main dashboard page
│   │   ├── hooks/
│   │   │   └── useWebSocket.js          # WebSocket connection hook
│   │   ├── services/
│   │   │   ├── api.js                   # HTTP client for backend
│   │   │   └── supabase.js              # Supabase auth client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
│
├── DATABASE_SCHEMA.md          # Supabase SQL schema
├── SETUP_GUIDE.md              # Installation instructions
├── PROJECT_STRUCTURE.md        # This file
└── README.md                   # Project overview
```

## Data Flow Architecture

```
┌─────────────┐
│   Python    │  Simulates realistic sensor data
│  Simulator  │  (temp, humidity, soil, light, CO2)
└──────┬──────┘
       │ Publishes every 2s
       ▼
┌─────────────┐
│    Redis    │  Pub/Sub + Cache
│             │  Channel: 'greenhouse:sensors'
└──────┬──────┘
       │ Subscribes
       ▼
┌─────────────┐
│   Node.js   │  1. Receives sensor data
│   Backend   │  2. Checks thresholds → generates alerts
│             │  3. Calculates metrics (water savings)
│             │  4. Batches data to Supabase (every 5 min)
└──────┬──────┘
       │ WebSocket (Socket.io)
       ▼
┌─────────────┐
│    React    │  1. Displays live sensor values
│  Frontend   │  2. Shows real-time charts
│             │  3. Alert notifications
│             │  4. Water savings dashboard
└─────────────┘
       │
       ▼
┌─────────────┐
│  Supabase   │  1. User authentication
│             │  2. Historical sensor data
│             │  3. Alert logs
│             │  4. Greenhouse config
└─────────────┘
```

## Component Responsibilities

### Simulator
- **What it does**: Generates realistic greenhouse sensor data
- **Output**: JSON with 5 sensor readings + timestamp
- **Frequency**: Every 2 seconds
- **Connection**: Writes to Redis pub/sub

### Backend
- **What it does**: Business logic hub
- **Responsibilities**:
  - Subscribe to Redis sensor data
  - Detect threshold violations
  - Broadcast to frontend via WebSocket
  - Persist data to Supabase
  - Serve REST API for historical queries

### Frontend
- **What it does**: User interface
- **Key features**:
  - Live sensor cards with color coding
  - Real-time line charts (Recharts)
  - Alert toast notifications
  - Water savings counter
  - Historical trends

### Redis
- **Purpose**: Real-time data cache and pub/sub
- **Stores**:
  - Latest sensor readings (60 seconds)
  - Active alert state
- **Why not just Supabase?**: Too slow for real-time updates

### Supabase
- **Purpose**: Persistent storage and auth
- **Stores**:
  - User accounts
  - Greenhouse configurations
  - Historical sensor data (5-min intervals)
  - Alert logs
  - Irrigation events

## Tech Stack Summary

| Layer | Technology | Why |
|-------|-----------|-----|
| **Sensor Sim** | Python | Easy math/random generation, Redis library |
| **Real-time Cache** | Redis | Pub/sub for live updates, ultra-fast |
| **Backend** | Node.js | Non-blocking I/O, WebSocket support |
| **Database** | Supabase | Free tier, built-in auth, PostgreSQL |
| **Frontend** | React | Component architecture, rich ecosystem |
| **Charts** | Recharts | React-native, easy to use |
| **WebSocket** | Socket.io | Automatic reconnection, fallbacks |
| **Styling** | Tailwind CSS | Fast prototyping, responsive |

## Must-Have Features Mapped to Files

### 1. Live Dashboard
- `frontend/src/pages/Dashboard.jsx` - Main layout
- `frontend/src/components/dashboard/SensorCard.jsx` - Sensor displays
- `frontend/src/components/dashboard/SensorChart.jsx` - Charts
- `frontend/src/hooks/useWebSocket.js` - Real-time connection

### 2. Smart Alerts
- `backend/services/alertService.js` - Threshold detection
- `frontend/src/components/alerts/AlertPanel.jsx` - Alert UI
- `frontend/src/components/alerts/AlertItem.jsx` - Individual alerts

### 3. Water Savings
- `backend/services/metricsService.js` - Calculation logic
- `frontend/src/components/metrics/MetricsPanel.jsx` - Display

### 4. Optimal Range Indicators
- `frontend/src/components/dashboard/SensorCard.jsx` - Status colors
- `simulator/config.py` - Tomato optimal ranges

## Development Workflow

1. **Start with simulator**: Get data flowing to Redis
2. **Backend next**: Subscribe to Redis, log data to console
3. **Connect WebSocket**: Ensure backend broadcasts to frontend
4. **Build UI components**: One at a time (sensor cards → charts → alerts)
5. **Add persistence**: Wire up Supabase for history
6. **Polish**: Styling, animations, edge cases

## File Naming Conventions

- **React components**: PascalCase (e.g., `SensorCard.jsx`)
- **Services/utilities**: camelCase (e.g., `alertService.js`)
- **Config files**: lowercase (e.g., `vite.config.js`)
- **Python files**: snake_case (e.g., `sensor_simulator.py`)
